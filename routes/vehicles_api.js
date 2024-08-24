const express = require('express');
const router  = express.Router();
const vehiclesQueries = require('../db/queries/vehicles');

router.get('/', (req, res) => {
  vehiclesQueries.getVehicles()
    .then(vehicles => {
      res.json({ vehicles });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;