const express = require('express');
const router = express.Router();
const { getParkingSpaces } = require('../db/queries/parking_spaces');
const { createNewReservation } = require('../db/queries/create_new_reservation');
const { getReservations } = require('../db/queries/reservations');
const { getReservationByUserId } = require('../db/queries/get_reservation_by_userID');

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const result = await getReservations();
    res.json(result);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get reservations by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.session.userId;
    const result = await getReservationByUserId(userId);
    res.json(result);
  } catch (error) {
    console.error('Error fetching reservations by user ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all available parking spaces
router.get('/parking-spaces', async (req, res) => {
  try {
    const spaces = await getParkingSpaces();
    res.json(spaces);
  } catch (error) {
    console.error('Error fetching parking spaces:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new reservation
router.post('/', async (req, res) => {
  const { parkingSpaceId, reservationStart, reservationEnd } = req.body;
  const userId = req.session.userId; 

  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  try {
    await createNewReservation(userId, parkingSpaceId, reservationStart, reservationEnd);
    res.status(201).json({ message: 'Reservation created successfully.' });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
