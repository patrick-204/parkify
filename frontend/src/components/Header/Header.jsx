import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, InputBase, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import SearchIcon from "@material-ui/icons/Search";
import AddButton from "../AddButton/AddButton";
import useStyles from './styles';
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import ManageParking from '../ManageParking/ManageParking';

const Header = ({ isLoggedIn, onLogout, currentPath, onHeaderLoad, onLogin }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [addParkingOpen, setAddParkingOpen] = useState(false);
  const navigate = useNavigate();

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

  const loginHandleClickOpen = () => {
    setLoginOpen(true);
  };

  const loginHandleClose = () => {
    setLoginOpen(false);
  };

  const RegisterHandleClickOpen = () => {
    setRegisterOpen(true);
  };

  const RegisterHandleClose = () => {
    setRegisterOpen(false);
  };

  const addParkingHandleClickOpen = () => {
    setAddParkingOpen(true);
  };

  const addParkingHandleClose = () => {
    setAddParkingOpen(false);
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography
          variant="h5"
          className={classes.title}
          style={{ color: 'green' }}
          onClick={() => navigate('/')} 
        >
          Parkify
        </Typography>

        <Box display="flex" flexGrow={1}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Ready to park?"
              classes={{ root: classes.inputRoot, input: classes.inputInput }}
            />
          </div>
        </Box>

        <Box display="flex" className={classes.button}>
          {!isLoggedIn ? (
            <div>
              <Button
                variant="contained"
                style={{ backgroundColor: '#3c3c3c', color: "green" }}
                onClick={RegisterHandleClickOpen}
                className={isHome ? classes.activeButton : undefined}
              >
                Register
              </Button>
              <Dialog open={registerOpen} onClose={RegisterHandleClose}>
                <DialogTitle>Register</DialogTitle>
                <DialogContent>
                  <RegisterPage isLoggedIn={isLoggedIn} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={RegisterHandleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                variant="contained"
                style={{ backgroundColor: '#3c3c3c', color: "green" }}
                onClick={loginHandleClickOpen}
                className={isHome ? classes.activeButton : undefined}
              >
                Login
              </Button>
              <Dialog open={loginOpen} onClose={loginHandleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                  <LoginPage isLoggedIn={isLoggedIn} onLogin={onLogin} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={loginHandleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : (
            <div>
              <Button
                variant="contained"
                style={{ backgroundColor: '#3c3c3c', color: "red" }}
                onClick={addParkingHandleClickOpen}
              >
                My Parking Spaces
                </Button>
                <Dialog open={addParkingOpen} onClose={addParkingHandleClose}>
                  <DialogTitle>My Parking Spaces</DialogTitle>
                  <DialogContent>
                    <ManageParking isLoggedIn={isLoggedIn} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={addParkingHandleClose} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
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
