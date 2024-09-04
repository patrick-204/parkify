const pool = require('../connection');

/**
 * Update reservation status to comfirmed if already exists.
 */

const updateReservationStatus = async (status, parkingSpaceId, reservationStart, reservationEnd) => {
  const queryString = `
    UPDATE reservations 
    SET status = $1 
    WHERE parking_space_id = $2 AND reservation_start = $3 AND reservation_end = $4;
  `;

  return pool
    .query(queryString, [status, parkingSpaceId, reservationStart, reservationEnd])
    .then(() => {
    })
    .catch((err) => {
      console.error("Error updating reservation status to confirmed:", err.message);
      throw err;
    });
};

module.exports = {
  updateReservationStatus
};
