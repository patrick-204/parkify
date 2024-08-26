const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51PjqBV072KK9cj5n1SJAd3mzXSH1KlHi4K4DbXp4nE0dT6PuCMf55PbfN8DD7iFfE9edaylAhJEqBikQ7ui7NrKn001H3IQd2L');

// Import the function
const { priceOfParking } = require('../db/queries/price_of_parking');

router.get('/', (req, res) => {
  res.render('checkout');
});

router.get('/success', (req, res) => {
  res.render('success');
});

router.get('/cancel', (req, res) => {
  res.render('cancel');
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    // Replace with the actual parking spot ID you want to charge for
    const parkingSpotId = 2;
    
    // Retrieve the price from the database
    const result = await priceOfParking(parkingSpotId);

    if (!result) {
      return res.status(400).send('Price not found.');
    }

    const amountInDollars = result.amount; // Amount in dollars
    const amountInCents = Math.round(amountInDollars * 100); // Convert dollars to cents

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Parking Spot',
            },
            unit_amount: amountInCents, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:8080/checkout/success',
      cancel_url: 'http://localhost:8080/checkout/cancel',
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
