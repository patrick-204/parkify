import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ isLoggedIn, onLogout }) => {
  return (
    <div>
      <h1>Have fun! 🥔</h1>
      {!isLoggedIn ? (
        <div>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); onLogout(); }} style={{ display: 'inline' }}>
          <button type="submit">Logout</button>
        </form>
      )}
    </div>
  );
};

export default HomePage;
