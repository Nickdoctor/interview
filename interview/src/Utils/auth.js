import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// Sign Up Function
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error signing up:', error.message);
    return { error: error.message };
  }

  return { data };
};

// Log In Function
export const logIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log('Login session:', data?.session);

  if (error) {
    console.error('Error logging in:', error.message);
    return { error: error.message };
  }

  return { data };
};

// Log Out Function
export const logOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error logging out:', error.message);
    return { error: error.message };
  } else {
    console.log('User logged out successfully');
    return { success: true };
    //window.location.reload();
  }

  
};