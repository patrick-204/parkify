const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  req.session = null;
  res.clearCookie('session', { path: '/' }); 
  res.status(200).json({ message: 'Logout successful.' });
});

module.exports = router;
