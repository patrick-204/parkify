const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('checkout');
});

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // TODO() query for price correctly from payments table
        // price: '{{PRICE_ID}}',
        price: '{ 5 }',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

module.exports = router;
