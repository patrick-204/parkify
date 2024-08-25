const pool = require('../connection');

/**
 * Add a user to the users db.
 */
const addUserToUsersDatabase = function(name, password, email, phone) {
  const queryString = `  INSERT INTO users (name, password, email, phone)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;

  return pool
  .query(queryString, [name, password, email, phone])
  .then((result) => {
    // console.log(result.rows[0]);
    return result.rows[0];
  })
  .catch((err) => {
    console.error("Error adding user to users database:", err.message); 
    throw err; 
  });
};

module.exports = {
  addUserToUsersDatabase
};
