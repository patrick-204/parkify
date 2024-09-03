import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CheckoutPage from './components/CheckoutPage';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import ReservationsPage from './components/ReservationsPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user-login/check-login', { credentials: 'include' });
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  // User logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/user-logout', { method: 'POST', credentials: 'include' });
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout/parking/:parkingSpaceId" element={<CheckoutPage />} /> 
        <Route path="/checkout/success" element={<SuccessPage />} />
        <Route path="/checkout/cancel" element={<CancelPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
