import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

function Message() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="Disable" onClick={handleClickOpen}>
        Message
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

export default Message;
