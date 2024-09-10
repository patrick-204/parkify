const db = require('../connection');

const addParkingSpace = (location, streetAddress, city, province, price, ownerId) => {
  const query = `
    INSERT INTO parking_spaces (location, street_address, city, province, price, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  return db.query(query, [location, streetAddress, city, province, price, ownerId])
    .then(result => result.rows[0])
    .catch(err => {
      console.error('Error adding parking space to database', err.stack);
      throw err;
    });
};

module.exports = { addParkingSpace };