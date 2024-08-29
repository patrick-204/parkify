// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const App = () => {
  // Handle logged-in state and logout function
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;







// function App() {
//   // Define the fetchPhotos function to be used as an event handler
//   const fetchData = () => {
//     fetch('http://localhost:8080/api/users')
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! Status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log('Data received from backend:', data);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   };

//   // Return the JSX for rendering the component
//   return (
//     <div className="App">
//       <header className="App-header">
//         <button onClick={fetchData}>Fetch Data</button>
//       </header>
//     </div>
//   );
// }