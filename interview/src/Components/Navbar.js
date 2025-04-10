import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const MyNavbar = () => {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
      Time Sheet App 
    </Navbar>
  );
};

export default MyNavbar;
