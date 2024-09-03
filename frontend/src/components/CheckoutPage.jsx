import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const CheckoutPage = () => {
  const { parkingSpaceId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reservationStart = queryParams.get('start');
  const reservationEnd = queryParams.get('end');
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/checkout/parking/${parkingSpaceId}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPrice(data.price);
        } else {
          console.error('Failed to fetch price.');
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };

    fetchPrice();
  }, [parkingSpaceId]);

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          parkingSpaceId,
          reservationStart,
          reservationEnd
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
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
      {price ? <p>Price: ${price}</p> : <p>Loading price...</p>}
      <button onClick={handleCheckout} disabled={!price}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default CheckoutPage;
