const express = require('express');
const router = express.Router();

const { getUserWithEmail } = require('../db/queries/get_user_by_email');

router.get('/', (req, res) => {
  const parkifyUserID = req.session.userId;

  if (parkifyUserID) {
    res.redirect("/");
  }

  res.render("login");
});

router.post('/', (req, res) => {
  const { email, password } = req.body;

  const errors = [];
  if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    errors.push('A valid email is required.');
  }
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (errors.length > 0) {
    return res.render('login', { email, errors });
  }

  getUserWithEmail(email)
  .then((user) => {
    // If a user with the login email cannot be found, then return response with status 403
    if (!user) {
      return res.status(403).send("Email not found: Please create an account or enter the correct email");
    }

    // If a user that matches the email is found, then verify the password entered by the user
    // matches what is stored
    if (password !== user.password) {
      return res.status(403).send("Incorrect Password. Try Again.");
    }

    // Set a cookie inside the session object to the value of the user's ID
    req.session.user_id = user.id;

    // Set other required cookies
    req.session.email = user.email;
    req.session.name = user.username;

    res.redirect("/");
  })
  .catch((error) => {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  });


});

module.exports = router;