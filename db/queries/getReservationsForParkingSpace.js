// get_reservations_for_parking_space.js
const pool = require('../connection');

const getReservationsForParkingSpace = (parkingSpaceId) => {
  const queryString = `
    SELECT reservation_start, reservation_end
    FROM reservations
    WHERE parking_space_id = $1;
  `;
  
  return pool.query(queryString, [parkingSpaceId])
    .then(res => res.rows)
    .catch(err => {
      console.error("Error fetching reservations for parking space:", err.message);
      throw err;
    });
};

module.exports = {
  getReservationsForParkingSpace
};
