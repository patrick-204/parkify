const express = require('express');
const router = express.Router();


router.get('/register', (req, res) => {
  res.render('register'); 
});

router.post('/register', (req, res) => {
  const { username, password, email, phoneNumber } = req.body;

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
