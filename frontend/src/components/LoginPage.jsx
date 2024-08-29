import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/user-login', 
        { email, password }, 
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true // Include this option
        }
      );      
      setMessage(response.data.message);
      // Handle successful login (e.g., redirect, set user state)
    } catch (error) {
      if (error.response) {
        // Request made and server responded with a status code not in the range of 2xx
        setError(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server.');
      } else {
        // Something happened in setting up the request
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
