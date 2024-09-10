const express = require('express');
const router = express.Router();
const parkingSpacesQueries = require('../db/queries/parking_spaces');
const { addParkingSpace } = require('../db/queries/add_parking_space');
const { getParkingSpaceByUserId } = require('../db/queries/get_parking_spaces_by_user');

// Get all parking spaces
router.get('/', (req, res) => {
  parkingSpacesQueries.getParkingSpaces()
    .then(parkingSpaces => {
      res.json({ parkingSpaces });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Endpoint to fetch the parking spaces by user id
router.get('/parking-space/spaces', async (req, res) => {
  try {
    const ownerId = req.session.userId;
    console.log(ownerId);
    const result = await getParkingSpaceByUserId(ownerId);

    if (!result || result.length === 0) {
      return res.status(400).json({ error: 'User parking spaces not found.' });
    }

    res.json({ parkingSpaces: result });
  } catch (error) {
    console.error("Error retrieving parking spaces:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a parking space
router.post('/add', async (req, res) => {
  const { location, streetAddress, city, province, price } = req.body;

  const userId = req.session.userId; 

  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const errors = [];
  
  // Validate location (Ontario postal code)
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
  if (!location || !postalCodeRegex.test(location)) {
    errors.push('A valid Ontario postal code is required.');
  }

  // Validate street address
  if (!streetAddress || streetAddress.trim().length === 0) {
    errors.push('Street address is required.');
  }

  // Validate city
  if (!city || city.trim().length === 0) {
    errors.push('City is required.');
  }

  // Validate province
  if (!province || province.trim().length === 0) {
    errors.push('Province is required.');
  }

  // Validate price
  if (price === undefined || isNaN(price) || parseFloat(price) <= 0) {
    errors.push('Price must be a positive number.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    await addParkingSpace(location, streetAddress, city, province, price, userId);
    res.status(201).json({ message: 'Parking space added successfully.' });
  } catch (error) {
    console.error("Error adding parking space to parking spaces table:", error);
    res.status(500).json({ errors: ['Internal Server Error'] });
  }
});

module.exports = router;
