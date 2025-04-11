import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';
import pic1 from '../Assets/Corpay.png';
//import Container from 'react-bootstrap/Container';
//import Navbar from 'react-bootstrap/Navbar';

const MyNavbar = () => {
  const navigate = useNavigate();
  const corpayUrl = 'https://www.corpay.com/';

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">TimeSheet App</a>
        <a className="navbar-brand" href={corpayUrl} target="_blank" rel="noopener noreferrer">
          <img src={pic1} alt="corpay" width="185" height="50" />
        </a>
      </div>
    </nav>
  );
};

export default MyNavbar;
