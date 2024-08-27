const db = require('../connection');

const getVehicles = () => {
  return db.query('SELECT * FROM vehicles;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getVehicles };