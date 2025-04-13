// TimeSheetPage.test.js
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimeSheetPage } from './TimeSheetPage'; // adjust the import based on your folder structure
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook and supabase client for version 7.5
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(), // Mock useNavigate for React Router 7.5
}));

jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn(),
    select: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('TimeSheetPage', () => {
  let navigate;

  beforeEach(() => {
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  test('redirects to AuthPage if user is not logged in', async () => {
    // Mock getSession to return no session
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    render(<TimeSheetPage />);

    // Expect the user to be redirected to the AuthPage
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/AuthPage'));
  });

  test('allows logged-in user to create a timesheet entry', async () => {
    // Mock getSession to return a logged-in user
    const mockSession = {
      data: {
        session: { user: { id: 'user-id', email: 'test@example.com' } },
      },
    };
    supabase.auth.getSession.mockResolvedValue(mockSession);

    // Mock supabase insert method
    supabase.from.mockImplementationOnce(() => ({
      insert: jest.fn().mockResolvedValue({ data: [{ id: 1 }] }),
    }));

    render(<TimeSheetPage />);

    // Fill in the timesheet form
    fireEvent.change(screen.getByPlaceholderText('Rate per hour'), {
      target: { value: '20' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Worked on project' },
    });

    // Add line items
    fireEvent.change(screen.getByPlaceholderText('Minutes'), { target: { value: '120' } });
    fireEvent.change(screen.getByPlaceholderText('date'), { target: { value: '2025-04-12' } });

    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    // Wait for the success alert
    await waitFor(() => {
      expect(screen.getByText('Data saved successfully!')).toBeInTheDocument();
    });

    // Check if insert was called with the correct data
    expect(supabase.from).toHaveBeenCalledWith('timesheets');
    expect(supabase.from().insert).toHaveBeenCalledWith([
      {
        userId: 'user-id',
        lineItems: [{ date: '2025-04-12', minutes: '120' }],
        totalTime: 120,
        rate: '20',
        description: 'Worked on project',
        totalCost: 40,
      },
    ]);
  });

  test('loads previous data if available', async () => {
    // Mock the session to simulate a logged-in user
    const mockSession = {
      data: {
        session: { user: { id: 'user-id', email: 'test@example.com' } },
      },
    };
    supabase.auth.getSession.mockResolvedValue(mockSession);

    // Mock supabase select method to return some data
    const mockData = [
      {
        lineItems: [{ date: '2025-04-01', minutes: '60' }],
        totalTime: 60,
        rate: '20',
        description: 'Previous work',
        totalCost: 20,
      },
    ];
    supabase.from.mockResolvedValue({ data: mockData });

    render(<TimeSheetPage />);

    // Trigger load data button
    fireEvent.click(screen.getByText('Load Previous Data'));

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Previous work')).toBeInTheDocument();
      expect(screen.getByText('Total Time: 60 Minutes')).toBeInTheDocument();
    });
  });

  test('shows error when data load fails', async () => {
    const mockSession = {
      data: {
        session: { user: { id: 'user-id', email: 'test@example.com' } },
      },
    };
    supabase.auth.getSession.mockResolvedValue(mockSession);

    // Mock supabase select method to return an error
    supabase.from.mockResolvedValue({ data: [], error: { message: 'Failed to load data' } });

    render(<TimeSheetPage />);

    // Trigger load data button
    fireEvent.click(screen.getByText('Load Previous Data'));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load data.')).toBeInTheDocument();
    });
  });
});
