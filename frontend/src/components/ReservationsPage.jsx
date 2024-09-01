import React, { useState, useEffect } from 'react';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [parkingSpaceId, setParkingSpaceId] = useState('');
  const [reservationStart, setReservationStart] = useState('');
  const [reservationEnd, setReservationEnd] = useState('');
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // State to store error message

  // Fetch user ID and reservations on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserId();
      await fetchAvailableSpaces();
      await fetchReservations();
    };

    fetchData();
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user-login/check-login', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.isLoggedIn) {
        setUserId(data.userId);
      } else {
        console.error('User is not logged in.');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const fetchReservations = async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:8080/api/reservations/user/${userId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    }
  };

  const fetchAvailableSpaces = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reservations/parking-spaces', {
        credentials: 'include'
      });
      const data = await response.json();
      setAvailableSpaces(data);
    } catch (error) {
      console.error('Error fetching available spaces:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    if (new Date(reservationEnd) <= new Date(reservationStart)) {
      setErrorMessage('End time must be after start time.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          parkingSpaceId,
          reservationStart,
          reservationEnd
        }),
      });

      if (response.ok) {
        await fetchReservations();
        setParkingSpaceId('');
        setReservationStart('');
        setReservationEnd('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error); // Display error message
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setErrorMessage('An error occurred while creating the reservation.');
    }
  };

  return (
    <div>
      <h1>Reservations</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={parkingSpaceId}
          onChange={(e) => setParkingSpaceId(e.target.value)}
          required
        >
          <option value="">Select Parking Space</option>
          {availableSpaces.map(space => (
            <option key={space.id} value={space.id}>
              Parking Space {space.id}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={reservationStart}
          onChange={(e) => setReservationStart(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={reservationEnd}
          onChange={(e) => setReservationEnd(e.target.value)}
          required
        />
        <button type="submit">Add Reservation</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Parking Space ID</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map(reservation => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.user_id}</td>
                <td>{reservation.parking_space_id}</td>
                <td>{new Date(reservation.reservation_start).toLocaleString()}</td>
                <td>{new Date(reservation.reservation_end).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No reservations found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsPage;
