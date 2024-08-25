const express = require('express');
const router = express.Router();

// Import db functions
const { doesUserExist } = require('../db/queries/does_user_exist');
const { addUserToUsersDatabase } = require('../db/queries/add_user_to_users_db');


router.get('/register', (req, res) => {
  const parkifyUserID = req.session.userId;
  // const name = req.session.name;

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

  // Proceed with database operations if no validation errors
  doesUserExist(name)
    .then((userExists) => {
      if (userExists) {
        return res.status(409).send("User already exists.");
      } else {
        return addUserToUsersDatabase(name, password, email, phoneNumber);
      }
    })
    .then((newUser) => {
      // Store user ID or other relevant info in the session if needed
      req.session.userId = newUser.id; // Assuming `newUser` has an `id` property
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error adding user to users table:", error);
      res.status(500).send("Internal Server Error");
    });
});


module.exports = router;
