const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  req.session = null;
  res.clearCookie("session");
  res.redirect("/login");
});

module.exports = router;
