const pool = require('../connection');

/**
 * Does reservation already exist.
 */
const doesReservationExist = async (parkingSpaceId, reservationStart, reservationEnd) => {
  const queryString = `
    SELECT * FROM reservations 
    WHERE parking_space_id = $1 AND reservation_start = $2 AND reservation_end = $3;
  `;

  return pool
    .query(queryString, [parkingSpaceId, reservationStart, reservationEnd])
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error("Error checking if reservation already exists:", err.message);
      throw err;
    });
};

module.exports = {
  doesReservationExist
};
