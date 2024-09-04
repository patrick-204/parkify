import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/checkout/confirm-payment/${sessionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          setMessage('Payment successful and reservation confirmed!');
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || 'Payment was not successful.');
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        setMessage('Error confirming payment.');
      }
    };

    if (sessionId) {
      confirmPayment();
    }
  }, [sessionId]);

  return (
    <div>
      <h1>Payment Status</h1>
      <p>{message}</p>
    </div>
  );
};

export default SuccessPage;
