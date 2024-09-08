import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ isLoggedIn, onLogin }) => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); 

  // If the user is already logged in then redirect to homepage
  if (isLoggedIn) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/user-login', 
        { email, password }, 
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );      
      setMessage(response.data.message);

      // Send login status back to app
      if (onLogin) onLogin(true);

      // Redirect to home page after login
      navigate('/');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else if (error.request) {
        setError('No response from server.');
      } else {
        setError('Error in making request.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
