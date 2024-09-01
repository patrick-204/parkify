const pool = require('../connection');

/**
 * Check if the parking spot is available during the specified time period.
 */
const isParkingSpotAvailable = async (parkingSpaceId, reservationStart, reservationEnd) => {
  const queryString = `
    SELECT COUNT(*) FROM reservations 
    WHERE parking_space_id = $1
      AND (
        (reservation_start < $3 AND reservation_end > $2) OR
        (reservation_start < $2 AND reservation_end > $2) OR
        (reservation_start < $3 AND reservation_end > $3) OR
        (reservation_start >= $2 AND reservation_end <= $3)
      );
  `;
  
  try {
    const result = await pool.query(queryString, [parkingSpaceId, reservationStart, reservationEnd]);
    return parseInt(result.rows[0].count) === 0; // No overlapping reservations
  } catch (err) {
    console.error("Error checking parking spot availability:", err.message);
    throw err;
  }
};

module.exports = {
  isParkingSpotAvailable
};
