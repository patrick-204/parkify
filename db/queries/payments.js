const db = require('../connection');

const getPayments = () => {
  return db.query('SELECT * FROM payments;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getPayments };