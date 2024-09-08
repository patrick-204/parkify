import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, InputBase, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddButton from "../AddButton/AddButton";
import useStyles from './styles';
import LoginPage from "../LoginPage";

const Header = ({ isLoggedIn, onLogout, currentPath, onHeaderLoad, onLogin }) => {
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  // For path-based styles and logic
  const isHome = currentPath === '/';
  const isReservations = currentPath === '/reservations';
  const isSuccess = currentPath === '/checkout/success';

  useEffect(() => {
    if (onHeaderLoad) {
      onHeaderLoad(); 
    }
  }, [onHeaderLoad]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography
          variant="h5"
          className={classes.title}
          style={{ color: 'red' }}
        >
          Parkify
        </Typography>

        <Box display="flex" flexGrow={1}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search..."
              classes={{ root: classes.inputRoot, input: classes.inputInput }}
            />
          </div>
        </Box>

        <Box display="flex" className={classes.button}>
          {!isLoggedIn ? (
            <div>
              <Button
                variant="contained"
                style={{ backgroundColor: '#3c3c3c', color: "red" }}
                onClick={() => window.location.href = '/register'}
                className={isHome ? classes.activeButton : undefined}
              >
                Register
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#3c3c3c', color: "red" }}
                onClick={handleClickOpen}
                className={isHome ? classes.activeButton : undefined}
              >
                Login
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                  <LoginPage isLoggedIn={isLoggedIn} onLogin={onLogin} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : (
            <div>
              <Button>
                <AddButton />
              </Button>
              {isHome ? (
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#3c3c3c', color: "red" }}
                  onClick={() => window.location.href = '/reservations'}
                  className={isReservations ? classes.activeButton : undefined}
                >
                  Reservations
                </Button>
              ) : isReservations ? (
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#3c3c3c', color: "red" }}
                  onClick={() => window.location.href = '/'}
                  className={isHome ? classes.activeButton : undefined}
                >
                  Home Page
                </Button>
              ) : isSuccess ? (
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#3c3c3c', color: "red" }}
                  onClick={() => window.location.href = '/'}
                  className={isHome ? classes.activeButton : undefined}
                >
                  Home Page
                </Button>
              ) : null}
              <Button
                variant="contained"
                style={{ backgroundColor: '#3c3c3c', color: "red" }}
                onClick={(e) => {
                  e.preventDefault();
                  onLogout();
                }}
              >
                Logout
              </Button>
            </div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
