const express = require('express');
const router = express.Router();
const userParkingInfoQueries = require('../db/queries/users_parking')

// Get all users
router.get('/', (req, res) => {
  userParkingInfoQueries.getUsersParkingInfo()
      .then(users => {
        res.json({users});

      })
      .catch(err => {
        res
          .status(500)
          .json({error:err.message});
      });
});

module.exports = router;
