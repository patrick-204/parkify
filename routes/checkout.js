const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51PjqBV072KK9cj5n1SJAd3mzXSH1KlHi4K4DbXp4nE0dT6PuCMf55PbfN8DD7iFfE9edaylAhJEqBikQ7ui7NrKn001H3IQd2L');
const { priceOfParking } = require('../db/queries/price_of_parking');
const db = require('../db/connection');

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

    if (!result || !result.amount) {
      return res.status(400).json({ error: 'Price not found.' });
    }

    res.json({ price: result.amount });
  } catch (error) {
    console.error("Error retrieving price:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create checkout session
// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { parkingSpaceId, reservationStart, reservationEnd } = req.body;

    // Fetch the price of the parking spot
    const result = await priceOfParking(parkingSpaceId);
    if (!result || !result.amount) {
      return res.status(400).json({ error: 'Price not found.' });
    }

    const amountInCents = Math.round(result.amount * 100);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Parking Spot ${parkingSpaceId}`,
            },
            unit_amount: amountInCents,
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

// server/routes/checkout.js
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
      const result = await db.query(
        'SELECT * FROM reservations WHERE parking_space_id = $1 AND reservation_start = $2 AND reservation_end = $3',
        [metadata.parkingSpaceId, metadata.reservationStart, metadata.reservationEnd]
      );

      if (result.rows.length === 0) {
        // Create the reservation if it doesn't exist
        await db.query(
          'INSERT INTO reservations (user_id, parking_space_id, reservation_start, reservation_end, status) VALUES ($1, $2, $3, $4, $5)',
          [userId, metadata.parkingSpaceId, metadata.reservationStart, metadata.reservationEnd, 'confirmed']
        );
      } else {
        // Update the status if it already exists
        await db.query(
          'UPDATE reservations SET status = $1 WHERE parking_space_id = $2 AND reservation_start = $3 AND reservation_end = $4',
          ['confirmed', metadata.parkingSpaceId, metadata.reservationStart, metadata.reservationEnd]
        );
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
