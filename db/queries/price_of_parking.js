const db = require('../connection');

const priceOfParking = async (parkingSpotId) => {
  const queryString = `SELECT amount 
  FROM parking_spaces 
  WHERE id = $1`
  ;

  try {
    const result = await db.query(queryString, [parkingSpotId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; 
    }
  } catch (err) {
    console.error("Error checking price of parking spot:", err.message);
    throw err;
  }
};

module.exports = { priceOfParking };
