// TimeSheetPage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeSheetPage from '../Pages/TimeSheet';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../supabaseClient.js', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: 'user123', email: 'test@example.com' } } },
      }),
    },
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: {}, error: null }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      delete: jest.fn().mockResolvedValue({ data: {}, error: null }),
    })),
  },
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test('renders timesheet form with title', async () => {
  renderWithRouter(<TimeSheetPage />);
  expect(await screen.findByText(/Timesheet/i)).toBeInTheDocument();
});
