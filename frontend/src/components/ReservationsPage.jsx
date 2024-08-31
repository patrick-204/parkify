import React, { useState, useEffect } from 'react';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [parkingSpaceId, setParkingSpaceId] = useState('');
  const [reservationStart, setReservationStart] = useState('');
  const [reservationEnd, setReservationEnd] = useState('');
  const [userId, setUserId] = useState(null); // To store the logged-in user ID

  // Fetch user ID to filter reservations
  const fetchUserId = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user-login/check-login', {
        credentials: 'include' // Ensure cookies are sent
      });
      const data = await response.json();
      if (data.isLoggedIn) {
        setUserId(data.userId); // Set userId from response
      } else {
        console.error('User is not logged in.');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // Fetch reservations for the logged-in user
  const fetchReservations = async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:8080/api/reservations/user/${userId}`, {
          credentials: 'include' // Ensure cookies are sent
        });
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    }
  };

  // Fetch available parking spaces
  const fetchAvailableSpaces = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reservations/parking-spaces', {
        credentials: 'include' // Ensure cookies are sent
      });
      const data = await response.json();
      setAvailableSpaces(data);
    } catch (error) {
      console.error('Error fetching available spaces:', error);
    }
  };

  // Fetch user ID and data on component mount
  useEffect(() => {
    fetchUserId().then(() => {
      fetchReservations();
      fetchAvailableSpaces();
    });
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent
        body: JSON.stringify({
          parkingSpaceId,
          reservationStart,
          reservationEnd
        }),
      });

      if (response.ok) {
        // Refresh reservations list
        fetchReservations();
      } else {
        console.error('Error creating reservation:', await response.text());
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
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
          {reservations.map(reservation => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.user_id}</td>
              <td>{reservation.parking_space_id}</td>
              <td>{new Date(reservation.reservation_start).toLocaleString()}</td>
              <td>{new Date(reservation.reservation_end).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsPage;
