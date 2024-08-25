const express = require('express');
const router = express.Router();

// Import stripe
const stripe = require('stripe')('sk_test_51PjqBV072KK9cj5n1SJAd3mzXSH1KlHi4K4DbXp4nE0dT6PuCMf55PbfN8DD7iFfE9edaylAhJEqBikQ7ui7NrKn001H3IQd2L');

router.get('/', (req, res) => {
  res.render('checkout');
});

router.get('/success', (req, res) => {
  res.render('success');
});

router.get('/cancel', (req, res) => {
  res.render('cancel');
});

// Here for test - remove later
// Payment succeeds
// 4242 4242 4242 4242
// Payment requires authentication
// 4000 0025 0000 3155
// Payment is declined
// 4000 0000 0000 9995

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // TODO() query for price correctly from payments table
        // price: '{{PRICE_ID}}',
        price: 'price_1PrpUp072KK9cj5n7dDAzPDT',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:8080/checkout/success',
    cancel_url: 'http://localhost:8080/checkout/cancel',
    // success_url: `${YOUR_DOMAIN}/success.html`,
    // cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

module.exports = router;
