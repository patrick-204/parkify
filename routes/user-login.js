const express = require('express');
const router = express.Router();
const { getUserWithEmail } = require('../db/queries/get_user_by_email');

// Handle user login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const errors = [];
  if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    errors.push('A valid email is required.');
  }
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  // Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Get user from database
    const user = await getUserWithEmail(email);
    if (!user) {
      return res.status(403).json({ error: 'Email not found: Please create an account or enter the correct email' });
    }

    // Compare password with stored password (plaintext comparison)
    if (password !== user.password) {
      return res.status(403).json({ error: 'Incorrect Password. Try Again.' });
    }

    // Set session or token
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.name = user.username;

    // Send success response
    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
