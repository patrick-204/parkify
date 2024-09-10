import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addHours, isWithinInterval, format } from 'date-fns';
import Header from '../Header/Header';

// Convert local time to UTC
const localToUTC = (localDate) => {
  if (!localDate) return null;
  // Offset in milliseconds
  const offset = localDate.getTimezoneOffset() * 60000;
  return new Date(localDate.getTime() - offset);
};

// Convert UTC to local time
const utcToLocal = (utcDate) => {
  if (!utcDate) return null;
  // Offset in milliseconds
  const offset = utcDate.getTimezoneOffset() * 60000;
  return new Date(utcDate.getTime() + offset);
};

// Format date and time to 12-hour format
const formatTo12Hour = (date) => {
  return format(date, "MM/dd/yyyy h:mm a");
};

const ReservationsPage = ({ isLoggedIn, onLogout, currentPath, onHeaderLoad }) => {
  const [reservations, setReservations] = useState([]);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [parkingSpaceId, setParkingSpaceId] = useState('');
  const [reservationStart, setReservationStart] = useState(null);
  const [reservationEnd, setReservationEnd] = useState(null);
  const [userId, setUserId] = useState(null);
  const [reservedPeriods, setReservedPeriods] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  const fetchReservedPeriods = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reservations', {
        credentials: 'include'
      });
      const data = await response.json();
      setReservedPeriods(data.map(period => ({
        ...period,
        reservation_start: utcToLocal(new Date(period.reservation_start)),
        reservation_end: utcToLocal(new Date(period.reservation_end)),
      })));
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
        setLoading(false);
      }
    }
  };

  const isTimeSlotBooked = (date) => {
    return reservedPeriods.some(period => {
      const periodStart = localToUTC(new Date(period.reservation_start));
      const periodEnd = localToUTC(new Date(period.reservation_end));
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
      // Check both 00 and 30 minutes of each hour
      for (let minute of [0, 30]) {
        const slotStart = new Date(dateStart);
        slotStart.setHours(hour, minute);
        const slotEnd = new Date(slotStart);
        // Half-hour slot
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);

        if (isTimeSlotBooked(slotStart)) {
          disabledSlots.push(slotStart);
        }
      }
    }
    return disabledSlots;
  };

  const timeSlotDisabled = (time) => {
    const timeHalfHour = new Date(time);
    // Ensure seconds and milliseconds are zeroed out
    timeHalfHour.setSeconds(0, 0);

    return filterTimeSlots(time).some(slot => slot.getTime() === timeHalfHour.getTime());
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reservationStart || !reservationEnd || reservationStart >= reservationEnd) {
      setErrorMessage('Invalid reservation dates.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          parkingSpaceId,
          reservationStart: localToUTC(reservationStart),
          reservationEnd: localToUTC(reservationEnd),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Error creating checkout session.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setErrorMessage('Error creating checkout session.');
    }
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} currentPath={currentPath} onHeaderLoad={onHeaderLoad} />
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
          timeIntervals={30}
          dateFormat="MM/dd/yyyy h:mm a"
          filterTime={time => !timeSlotDisabled(time)}
          placeholderText="Select start date"
          required
        />
        <DatePicker
          selected={reservationEnd}
          onChange={(date) => setReservationEnd(date)}
          showTimeSelect
          timeIntervals={30}
          dateFormat="MM/dd/yyyy h:mm a"
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
                <td>{formatTo12Hour(new Date(reservation.reservation_start))}</td>
                <td>{formatTo12Hour(new Date(reservation.reservation_end))}</td>
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
