const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51PjqBV072KK9cj5n1SJAd3mzXSH1KlHi4K4DbXp4nE0dT6PuCMf55PbfN8DD7iFfE9edaylAhJEqBikQ7ui7NrKn001H3IQd2L');
const { priceOfParking } = require('../db/queries/price_of_parking');

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
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { parkingSpaceId } = req.body;
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
      success_url: 'http://localhost:3000/checkout/success',
      cancel_url: 'http://localhost:3000/checkout/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
