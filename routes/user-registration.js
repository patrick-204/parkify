const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 

// Import db functions
const { doesUserExist } = require('../db/queries/does_user_exist');
const { addUserToUsersDatabase } = require('../db/queries/add_user_to_users_db');

router.post('/', async (req, res) => {
  const { name, password, email, phoneNumber } = req.body;

  const errors = [];
  if (!name || name.trim().length === 0) {
    errors.push('Name is required.');
  }
  if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    errors.push('A valid email is required.');
  }
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
    errors.push('Phone number must be a 10-digit number.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const userExists = await doesUserExist(email);
    if (userExists) {
      return res.status(409).json({ errors: ['User already exists.'] });
    }

    await addUserToUsersDatabase(name, password, email, phoneNumber);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error("Error adding user to users table:", error);
    res.status(500).json({ errors: ['Internal Server Error'] });
  }
});

module.exports = router;
