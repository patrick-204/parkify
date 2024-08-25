const express = require('express');
const router = express.Router();

// Import db functions
const { doesUserExist } = require('../db/queries/does_user_exist');
const { addUserToUsersDatabase } = require('../db/queries/add_user_to_users_db');


router.get('/register', (req, res) => {
  const parkifyUserID = req.session.user_id;
  // const userName = req.session.name;

  if (!parkifyUserID) {
    res.render('register'); 
  } else {
    res.redirect('/');
  }
});

router.post('/register', (req, res) => {
  const { name, password, email, phoneNumber } = req.body;

  // Check if the user already exists in the database
  doesUserExist(name)
  .then((userExists) => {
    if (userExists) {
      return res.status(409).send("User already exists.");
    } else {
      // Add a new user to the database
      addUserToUsersDatabase(name, password, email, phoneNumber)
        .then((newUser) => {
          // console.log(newUser);
          res.redirect("/");
        })
        .catch((error) => {
          console.error("Error adding user to organization:", error);
          res.status(500).send("Internal Server Error");
        });
    }
  })
  .catch((error) => {
    console.error("Error checking for user existence:", error);
    res.status(500).send("Internal Server Error");
  });

  const errors = [];
  if (!username || username.trim().length === 0) {
    errors.push('Username is required.');
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
    res.render('register', { errors, username, email, phoneNumber });
  } else {
    res.redirect('/');
  }
});


module.exports = router;
