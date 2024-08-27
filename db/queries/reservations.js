const db = require('../connection');

const getReservations = () => {
  return db.query('SELECT * FROM reservations;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getReservations };