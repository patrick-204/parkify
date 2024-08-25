const pool = require('../connection');

/**
 * Add a user to the users db.
 */
const addUserToUsersDatabase = function(name, email, password, phone) {
  const queryString = `  INSERT INTO users (username, email, password, organization_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;

  return pool
  .query(queryString, [name, email, password, phone])
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
