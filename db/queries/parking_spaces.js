const db = require('../connection');

const getParkingSpaces = () => {
  return db.query('SELECT * FROM parking_spaces;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getParkingSpaces };
