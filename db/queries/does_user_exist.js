const pool = require('../connection');

// /**
//  * Check if user already exists.
//  */
const doesUserExist = function(name, email) {
  const queryString = `
  SELECT * FROM users
  WHERE name = $1 OR email = $2;
  `;

  return pool
    .query(queryString, [name, email])
    .then((result) => {
      if (result.rows.length > 0) {
        // console.log("user exists:", true);
        return true;
      } else {
        // console.log("user does not exist:", false);
        return false;
      }
    })
    .catch((err) => {
      console.error("Error checking if user already exists:", err.message); 
      throw err; 
    });
};

module.exports = {
  doesUserExist
};
