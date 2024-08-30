import React from 'react';

const CheckoutPage = () => {
  const handleCheckout = async () => {
    try {
      // Request to create a checkout session
      const response = await fetch('http://localhost:8080/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const { url } = await response.json();
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        console.error('Failed to create checkout session.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button onClick={handleCheckout}>Proceed to Payment</button>
    </div>
  );
};

export default CheckoutPage;
