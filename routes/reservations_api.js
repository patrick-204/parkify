const express = require('express');
const router  = express.Router();
const reservationsQueries = require('../db/queries/reservations');

router.get('/', (req, res) => {
  reservationsQueries.getReservations()
    .then(reservations => {
      res.json({ reservations});
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;