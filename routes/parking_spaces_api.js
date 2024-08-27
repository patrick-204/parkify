const express = require('express');
const router  = express.Router();
const parkingSpacesQueries = require('../db/queries/parking_spaces');

router.get('/', (req, res) => {
  parkingSpacesQueries.getParkingSpaces()
    .then(parking_spaces => {
      res.json({ parking_spaces });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;