import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import BookingReservationsPage from '../Booking/BookingReservationsPage';
import './style.css';

function Booking({bookingParkingSpaceId}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="Disabled" onClick={handleClickOpen}>
        Book
      </Button>

      <Dialog open={open} onClose={handleClose} classes={{ paper: 'dialog-paper' }}>
        <DialogTitle>Booking</DialogTitle>
        <DialogContent className="dialog-content">
          <BookingReservationsPage className="booking-reservations-page" bookingParkingSpaceId={bookingParkingSpaceId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Booking;
