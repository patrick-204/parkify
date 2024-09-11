const express = require('express');
const router = express.Router();
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { priceOfParking } = require('../db/queries/price_of_parking');
const { doesReservationExist } = require('../db/queries/does_reservation_exist');
const { createNewReservation } = require('../db/queries/create_new_reservation');
const { updateReservationStatus } = require('../db/queries/update_reservation_status');

// Here for test - remove later
// Payment succeeds
// 4242 4242 4242 4242
// Payment requires authentication
// 4000 0025 0000 3155
// Payment is declined
// 4000 0000 0000 9995

// Endpoint to fetch the price
router.get('/parking/:id', async (req, res) => {
  try {
    const parkingSpotId = parseInt(req.params.id);
    const result = await priceOfParking(parkingSpotId);

    if (!result || !result.price) {
      return res.status(400).json({ error: 'Price not found.' });
    }

    res.json({ price: result.price });
  } catch (error) {
    console.error("Error retrieving price:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { parkingSpaceId, reservationStart, reservationEnd } = req.body;

    // Fetch the price of the parking spot
    const result = await priceOfParking(parkingSpaceId);
    if (!result || !result.price) {
      return res.status(400).json({ error: 'Price not found.' });
    }

    // Calculate the duration between reservationStart and reservationEnd
    const start = new Date(reservationStart);
    const end = new Date(reservationEnd);
    const durationInMinutes = (end - start) / (1000 * 60); // Duration in minutes
    const halfHourIntervals = Math.ceil(durationInMinutes / 30); // Rounding up to include partial intervals

    // Calculate the total amount in cents
    const pricePerHalfHour = result.price; // Price per half-hour
    const totalAmount = Math.round(pricePerHalfHour * halfHourIntervals * 100); // Total amount in cents

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Parking Spot ${parkingSpaceId}`,
            },
            unit_amount: totalAmount, // Use the calculated total amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:3000/checkout/cancel',
      metadata: {
        parkingSpaceId,
        reservationStart,
        reservationEnd,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch the checkout session and confirm the reservation
// Confirm payment and update reservation
router.post('/confirm-payment/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  userId = req.session.userId;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { metadata } = session;

    if (session.payment_status === 'paid') {
      // Check if the reservation already exists and is confirmed
      const result = await doesReservationExist(metadata.parkingSpaceId, metadata.reservationStart, metadata.reservationEnd);

      if (result.rows.length === 0) {
        // Create the reservation if it doesn't exist
        await createNewReservation(userId, metadata.parkingSpaceId, metadata.reservationStart, metadata.reservationEnd, 'confirmed');
      } else {
        // Update the status if it already exists
        await updateReservationStatus('confirmed', metadata.parkingSpaceId, metadata.reservationStart, metadata.reservationEnd);
      }

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
