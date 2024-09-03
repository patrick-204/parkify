import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import { AppBar,Toolbar, Typography, InputBase,Box, Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import useStyles from './styles'

const Header = () => {
  const classes = useStyles()
  return(
    <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h5" className={classes.title}>
            Parkify


          </Typography>
          <div>

          <Button className="classes.button" color="inherit" position="left" >
            Add
          </Button>
          </div>
          <Box display="flex">
              <Typography variant="h6" className={classes.title}>

              </Typography>
              {/* <Autocomplete> */}
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                      <InputBase placeholder="Search..." classes={{root:classes.inputRoot, input:classes.inputInput}} />
                </div>
                <div display="flex" alignItems>
                  <button>Signup</button>
                  <button>Logout</button>
                  <button>Login</button>
                </div>

              {/* </Autocomplete> */}
          </Box>

        </Toolbar>

    </AppBar>
  )
}
export default Header;
