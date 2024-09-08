import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import { AppBar, Toolbar, Typography, InputBase, Box, Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import AddButton from "../AddButton/AddButton";
import useStyles from './styles';

const Header = ({ isLoggedIn, onLogout, currentPath }) => {
  const classes = useStyles();

  // For path-based styles and logic
  const isHome = currentPath === '/';
  const isReservations = currentPath === '/reservations';
  const isSuccess = currentPath === '/checkout/success';

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

        <Box display="flex">
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
                onClick={() => window.location.href = '/login'}
                className={isHome ? classes.activeButton : undefined}
              >
                Login
              </Button>
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
