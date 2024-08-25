const express = require('express');
const router = express.Router();

// Import db functions
const { doesUserExist } = require('../db/queries/does_user_exist');
const { addUserToUsersDatabase } = require('../db/queries/add_user_to_users_db');

router.get('/register', (req, res) => {
  const parkifyUserID = req.session.userId;

  if (!parkifyUserID) {
    res.render('register'); 
  } else {
    res.redirect('/');
  }
});

router.post('/register', (req, res) => {
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
    return res.render('register', { errors, name, email, phoneNumber });
  }

  doesUserExist(name, email)
    .then((userExists) => {
      if (userExists) {
        errors.push('User already exists.');
        return res.status(409).render('register', { errors, name, email, phoneNumber });
      }

      return addUserToUsersDatabase(name, password, email, phoneNumber);
    })
    .then((newUser) => {
      // Setting user id for session to maybe use later
      // req.session.userId = newUser.id; 
      res.redirect("/login"); 
    })
    .catch((error) => {
      console.error("Error adding user to users table:", error);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error");
      }
    });
});

module.exports = router;
