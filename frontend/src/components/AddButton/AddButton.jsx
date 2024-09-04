import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

function AddButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="diabled" onClick={handleClickOpen}>
        Add Parking
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Modal Heading</DialogTitle>
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

export default AddButton;
