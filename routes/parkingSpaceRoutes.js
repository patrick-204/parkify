const express = require('express');
const router = express.Router();
const parkingSpacesQueries = require('../db/queries/parking_spaces.js')

// Get all users
router.get('/', (req, res) => {
  parkingSpacesQueries.getParkingSpaces()
      .then(parkingSpaces => {
        res.json({parkingSpaces});

      })
      .catch(err => {
        res
          .status(500)
          .json({error:err.message});
      });
});

// // Get a user by ID
// router.get('/:id', (req, res) => {
//   const user = users.find(u => u.id === parseInt(req.params.id));
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404).send('User not found');
//   }
// });

// // Create a new user
// router.post('/', (req, res) => {
//   const { id, name, email } = req.body;
//   if (!id || !name || !email) {
//     return res.status(400).send('Missing user data');
//   }
//   const newUser = { id, name, email };
//   users.push(newUser);
//   res.status(201).json(newUser);
// });

// // Update a user by ID
// router.put('/:id', (req, res) => {
//   const { name, email } = req.body;
//   const user = users.find(u => u.id === parseInt(req.params.id));
//   if (user) {
//     if (name) user.name = name;
//     if (email) user.email = email;
//     res.json(user);
//   } else {
//     res.status(404).send('User not found');
//   }
// });

// // Delete a user by ID
// router.delete('/:id', (req, res) => {
//   const index = users.findIndex(u => u.id === parseInt(req.params.id));
//   if (index !== -1) {
//     users.splice(index, 1);
//     res.status(204).send();
//   } else {
//     res.status(404).send('User not found');
//   }
// });

module.exports = router;
