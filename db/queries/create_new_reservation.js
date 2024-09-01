const pool = require('../connection');

/**
 * Create a new reservation in the database.
 */
const createNewReservation = async (userId, parkingSpaceId, reservationStart, reservationEnd) => {
  const queryString = `
    INSERT INTO reservations (user_id, parking_space_id, reservation_start, reservation_end) 
    VALUES ($1, $2, $3, $4);
  `;

  return pool
    .query(queryString, [userId, parkingSpaceId, reservationStart, reservationEnd])
    .then(() => {
    })
    .catch((err) => {
      console.error("Error creating reservation:", err.message);
      throw err;
    });
};

module.exports = {
  createNewReservation
};
