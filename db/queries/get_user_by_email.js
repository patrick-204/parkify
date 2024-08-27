const pool = require('../connection');

/**
 * Get a single user from the database given their email.
 */
const getUserWithEmail = function(email) {
  return pool
  .query(`SELECT * FROM users WHERE email = $1`, [email])
  .then((result) => {
    // console.log(result.rows[0]);
    return result.rows[0];
  })
  .catch((err) => {
    console.error("Error fetching user:", err.message); 
    throw err; 
  });
};

module.exports = {
  getUserWithEmail
};
