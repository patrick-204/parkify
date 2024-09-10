import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getLocationsData } from './api/api';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CheckoutPage from './components/CheckoutPage';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import ReservationsPage from './components/ReservationsPage';

const App = () => {
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(true);
  const [childHovered,setChildHovered] = useState(null);


  useEffect(()=>{
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const {latitude, longitude} = position.coords;
            setCurrentLocation({lat:latitude, lng:longitude});
          },
          (error) => {
            console.error("Error fetching location:", error);
          }
        );

      }else {
        console.log("Geolocation is not supported by this browser")
      }
    },[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLocationsData();
        setParkingSpaces(response.data.parkingSpaces);
      } catch (error) {
        console.error('Error fetching locations data:', error);
      }
    };

    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user-login/check-login', { credentials: 'include' });
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    

    // Perform all async operations
    const initializeApp = async () => {
      await fetchData();
      await checkLoginStatus();
      // getLocation();
      setLoading(false);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', updatePath);
    updatePath();

    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  const handleLogin = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    // if (loggedIn) window.location.href = '/';
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/user-logout', { method: 'POST', credentials: 'include' });
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const onHeaderLoad = () => {
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            parkingSpaces={parkingSpaces}
            currentLocation={currentLocation}
            currentPath={currentPath}
            onHeaderLoad={onHeaderLoad}
            onLogin={handleLogin}
            childHovered={childHovered}
            setChildHovered={setChildHovered}
            />}
        />
        <Route
          path="/login"
          element={<LoginPage isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={<RegisterPage isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/checkout/parking/:parkingSpaceId"
          element={<CheckoutPage />}
        />
        <Route
          path="/checkout/success"
          element={<SuccessPage isLoggedIn={isLoggedIn} onLogout={handleLogout} currentPath={currentPath} onHeaderLoad={onHeaderLoad} />}
        />
        <Route
          path="/checkout/cancel"
          element={<CancelPage />}
        />
        <Route
          path="/reservations"
          element={<ReservationsPage isLoggedIn={isLoggedIn} onLogout={handleLogout} currentPath={currentPath} onHeaderLoad={onHeaderLoad} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
