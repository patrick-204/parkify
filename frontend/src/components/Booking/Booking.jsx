import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

function Booking() {
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Booking</DialogTitle>
        <DialogContent>
          Modal body..
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
