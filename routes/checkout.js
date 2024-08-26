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

router.get('/', async (req, res) => {
  try {
    // Forcing to parking spot id 1 for now
    const parkingSpotId = 1; 

    const result = await priceOfParking(parkingSpotId);

    if (!result || !result.amount) {
      return res.status(400).send('Price not found.');
    }

    const amountInDollars = Number(result.amount);

    if (isNaN(amountInDollars)) {
      throw new Error("Invalid amount value");
    }

    const formattedPrice = amountInDollars.toFixed(2); 

    res.render('checkout', { price: formattedPrice });
  } catch (error) {
    console.error("Error retrieving price:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get('/success', (req, res) => {
  res.render('success');
});

router.get('/cancel', (req, res) => {
  res.render('cancel');
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    // Forcing to parking spot id 1 for now
    const parkingSpotId = 1;
    
    const result = await priceOfParking(parkingSpotId);

    if (!result) {
      return res.status(400).send('Price not found.');
    }

    const amountInDollars = result.amount; 
    const amountInCents = Math.round(amountInDollars * 100); 

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Parking Spot', // replace with parking spot name later
            },
            unit_amount: amountInCents, 
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
