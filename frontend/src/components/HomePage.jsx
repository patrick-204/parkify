import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ isLoggedIn, onLogout }) => {
  return (
    <div>
      <h1>Have fun! 🥔</h1>
      {isLoggedIn && (
        <form onSubmit={(e) => { e.preventDefault(); onLogout(); }} style={{ display: 'inline' }}>
          <button type="submit">Logout</button>
        </form>
      )}
    </div>
  );
};

export default HomePage;
