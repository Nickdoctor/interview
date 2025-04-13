import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';
import pic1 from '../Assets/Corpay.png';
import { Nav } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
//import Container from 'react-bootstrap/Container';
//import Navbar from 'react-bootstrap/Navbar';

const MyNavbar = () => {
  const navigate = useNavigate();
  const corpayUrl = 'https://www.corpay.com/';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    // Check if a user is already logged in when the component mounts
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuthStatus();

    // Set up an auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    // Clean up the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('User signed out successfully');
      setIsLoggedIn(false);
      //window.location.reload();
      navigate('/AuthPage');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };


  return (
    <Nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">TimeSheet App</a>
        
        <Nav className="ms-auto gap-3">
          {isLoggedIn ? (
            <Nav.Link
              className="btn btn-primary me-2"
              onClick={handleSignOut}
            >
              Sign Out
            </Nav.Link>
          ) : (
            <Nav.Link
              className="btn btn-primary me-2"
              onClick={() => handleNavigation('/AuthPage')}
            >
              Sign In
            </Nav.Link>
          )}
          <Nav.Link className="btn btn-outline-secondary" onClick={() => handleNavigation('/AuthPage')}>Sign up</Nav.Link>
        </Nav>
        <a className="navbar-brand ms-3" href={corpayUrl} target="_blank" rel="noopener noreferrer" >
          <img src={pic1} alt="corpay" width="185" height="50"/>
        </a>
      </div>
    </Nav>
  );
};

export default MyNavbar;
