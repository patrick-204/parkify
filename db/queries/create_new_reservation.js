const pool = require('../connection');

/**
 * Create new reservation
 */
const createNewReservation = async (userId, parkingSpaceId, reservationStart, reservationEnd, status) => {
  const queryString = `
    INSERT INTO reservations (user_id, parking_space_id, reservation_start, reservation_end, status) 
    VALUES ($1, $2, $3, $4, $5);
  `;

  return pool
    .query(queryString, [userId, parkingSpaceId, reservationStart, reservationEnd, status])
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
