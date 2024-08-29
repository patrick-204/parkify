import React from 'react';
import { link } from 'react-router-dom';

const HomePage = ({ isLoggedIn, onLogout }) => {
  return (
    <div>
      <h1>Have fun! 🥔</h1>
      {isLoggedIn && (
        <form action="/logout" method="post" style={{ display: 'inline' }}>
          <button type="submit" onClick={onLogout}>Logout</button>
        </form>
      )}
    </div>
  );
};

export default HomePage