const express = require('express');
const router  = express.Router();
const paymentsQueries = require('../db/queries/payments');

router.get('/', (req, res) => {
  paymentsQueries.getPayments()
    .then(payments => {
      res.json({ payments });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;