const express = require('express');
const router = express.Router();
const { getParkingSpaces } = require('../db/queries/parking_spaces');
const { createNewReservation } = require('../db/queries/create_new_reservation');
const { getReservations } = require('../db/queries/reservations');
const { getReservationByUserId } = require('../db/queries/get_reservation_by_userID');
const { isParkingSpotAvailable } = require('../db/queries/is_parking_space_available');
const { getReservationsForParkingSpace } = require('../db/queries/getReservationsForParkingSpace');
const db = require('../db/connection');

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

// Get reservations for a specific parking space
router.get('/parking-space/:parkingSpaceId', async (req, res) => {
  const parkingSpaceId = req.params.parkingSpaceId;

  try {
    const result = await getReservationsForParkingSpace(parkingSpaceId);
    res.json(result);
  } catch (error) {
    console.error('Error fetching reservations for parking space:', error);
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

  // Check if the parking spot is available
  const isAvailable = await isParkingSpotAvailable(parkingSpaceId, reservationStart, reservationEnd);

  if (!isAvailable) {
    // Send a specific error response for reservation conflict
    return res.status(409).json({ error: 'Parking spot is already reserved during this time.' });
  }

  try {
    await createNewReservation(userId, parkingSpaceId, reservationStart, reservationEnd, 'confirmed');
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// todo() - If have time will add this so duplicate reservations cannot take place
// Create a pending reservation
router.post('/pending', async (req, res) => {
  const { parkingSpaceId, reservationStart, reservationEnd } = req.body;

  try {
    // Insert a pending reservation into the database
    const result = await db.query(
      'INSERT INTO reservations (user_id, parking_space_id, reservation_start, reservation_end, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.user.id, parkingSpaceId, reservationStart, reservationEnd, 'pending']
    );

    const reservationId = result.rows[0].id;

    res.status(201).json({ reservationId });
  } catch (error) {
    console.error('Error creating pending reservation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
