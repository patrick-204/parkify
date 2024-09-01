import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addHours, isWithinInterval } from 'date-fns';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [parkingSpaceId, setParkingSpaceId] = useState('');
  const [reservationStart, setReservationStart] = useState(null);
  const [reservationEnd, setReservationEnd] = useState(null);
  const [userId, setUserId] = useState(null);
  const [reservedPeriods, setReservedPeriods] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch user ID and available parking spaces on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserId();
      await fetchAvailableSpaces();
    };

    fetchData();
  }, []);

  // Fetch reserved periods when parking space ID is set
  useEffect(() => {
    if (parkingSpaceId) {
      fetchReservedPeriods(parkingSpaceId);
    }
  }, [parkingSpaceId]);

  // Fetch reservations for the logged-in user
  useEffect(() => {
    if (userId) {
      fetchReservations();
    }
  }, [userId]);

  // Fetch user ID
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

  // Fetch available parking spaces
  const fetchAvailableSpaces = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reservations/parking-spaces', {
        credentials: 'include'
      });
      const data = await response.json();
      setAvailableSpaces(data);
    } catch (error) {
      console.error('Error fetching parking spaces:', error);
    }
  };

  // Fetch reserved periods
  const fetchReservedPeriods = async (spaceId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/parking-space/${spaceId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setReservedPeriods(data);
    } catch (error) {
      console.error('Error fetching reserved periods:', error);
    }
  };

  // Fetch reservations for the logged-in user
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
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reservationStart || !reservationEnd || reservationStart >= reservationEnd) {
      setErrorMessage('Invalid reservation dates.');
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
        await fetchReservations(); // Refresh reservations list after adding a new reservation
        setParkingSpaceId('');
        setReservationStart(null);
        setReservationEnd(null);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Error creating reservation.');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setErrorMessage('Error creating reservation.');
    }
  };

  const isTimeSlotBooked = (date) => {
    return reservedPeriods.some(period => {
      const periodStart = new Date(period.reservation_start);
      const periodEnd = new Date(period.reservation_end);
      return isWithinInterval(date, { start: periodStart, end: periodEnd });
    });
  };

  const filterTimeSlots = (date) => {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    let disabledSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      const slotStart = addHours(dateStart, hour);
      const slotEnd = addHours(dateStart, hour + 1);
      if (isTimeSlotBooked(slotStart)) {
        disabledSlots.push(slotStart);
      }
    }
    return disabledSlots;
  };

  const timeSlotDisabled = (time) => {
    return filterTimeSlots(time).some(slot => slot.getTime() === time.getTime());
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

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
        <DatePicker
          selected={reservationStart}
          onChange={(date) => setReservationStart(date)}
          showTimeSelect
          dateFormat="Pp"
          filterTime={time => !timeSlotDisabled(time)}
          placeholderText="Select start date"
          required
        />
        <DatePicker
          selected={reservationEnd}
          onChange={(date) => setReservationEnd(date)}
          showTimeSelect
          dateFormat="Pp"
          filterTime={time => !timeSlotDisabled(time)}
          placeholderText="Select end date"
          required
        />
        <button type="submit">Add Reservation</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
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
