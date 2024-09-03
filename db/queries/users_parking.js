const db = require('../connection');

const getUsersParkingInfo = () => {
  return db.query('SELECT name, phone, location,email, parking_spaces.id,street_address,city,province,price, isreserved FROM users INNER JOIN parking_spaces ON users.id = parking_spaces.owner_id;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getUsersParkingInfo };
