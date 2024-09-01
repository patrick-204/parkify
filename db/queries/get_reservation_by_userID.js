const pool = require('../connection');

/**
 * Get reservations by user ID.
 * @param {number} userId - The ID of the user whose reservations are being queried.
 * @returns {Promise<Array>} - A promise that resolves to an array of reservation objects or an empty array.
 */
const getReservationByUserId = function(userId) {
  const queryString = `
    SELECT * FROM reservations WHERE user_id = $1;
  `;

  return pool
    .query(queryString, [userId])
    .then((result) => {
      console.log('get by res id', result.rows);
      return result.rows; // Return an array of reservations (can be empty if no reservations found)
    })
    .catch((err) => {
      console.error("Error getting reservations by User ID:", err.message);
      throw err; // Ensure errors are propagated
    });
};

module.exports = {
  getReservationByUserId
};
