import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import { AppBar, Toolbar, Typography, InputBase, Box, Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import AddButton from "../AddButton/AddButton";
import useStyles from './styles';

const Header = ({ isLoggedIn, onLogout }) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" className={classes.title} style={{ color: 'red' }}>
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
              >
                Register
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#3c3c3c', color: "red" }}
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
            </div>
          ) : (
            <div>
              <Button>
                <AddButton />
              </Button>
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
