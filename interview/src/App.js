import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TimeSheetPage from './Pages/TimeSheet.js';
import AuthPage from './Pages/AuthPage.js';

import MyNavbar from './Components/Navbar.js';
import Footer from './Components/Footer.js';

const App = () => {
  return (
    <Router>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<TimeSheetPage />} />
        <Route path="/TimeSheet" element={<TimeSheetPage />} />
        <Route path="/AuthPage" element={<AuthPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
