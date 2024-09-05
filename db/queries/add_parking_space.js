const db = require('../connection');

const addParkingSpace = (location, isReserved, ownerId) => {
  const query = `
    INSERT INTO parking_spaces (location, isReserved, owner_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  return db.query(query, [location, isReserved, ownerId])
    .then(result => result.rows[0])
    .catch(err => {
      console.error('Error executing query', err.stack);
      throw err;
    });
};

module.exports = { addParkingSpace };