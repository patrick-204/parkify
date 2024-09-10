const pool = require('../connection');

/**
 * Get parking spaces owner
 */
const getParkingSpaceByUserId = function(userId) {
  const queryString = `
    SELECT * FROM parking_spaces WHERE owner_id = $1;
  `;

  return pool
    .query(queryString, [userId])
    .then((result) => {
      return result.rows; 
    })
    .catch((err) => {
      console.error("Error getting owned parking spaces by User ID:", err.message);
      throw err; 
    });
};

module.exports = {
  getParkingSpaceByUserId
};
