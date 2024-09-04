import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import { AppBar,Toolbar, Typography, InputBase,Box, Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";


import AddButton from "../AddButton/AddButton";

import useStyles from './styles'

const Header = () => {
  const classes = useStyles()
  return(
    <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h5" className={classes.title} style={{color:'red'}}>
            Parkify


          </Typography>


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


              {/* </Autocomplete> */}
          </Box>
         
          <Box display="flex" className="classes.button" >

                <Button><AddButton/></Button>

                  <Button
                  variant="contained"
                  style={{backgroundColor: '#3c3c3c', color:"red"}}
                   onClick={() => window.location.href='/signup'}
                   >Signup</Button>
                  <Button
                  variant="contained"
                  style={{backgroundColor: '#3c3c3c', color:"red"}}
                   onClick={() => window.location.href='/logout'}>
                   Logout</Button>
                  <Button
                    variant="contained"
                    style={{backgroundColor: '#3c3c3c', color:"red"}}
                     onClick={() => window.location.href='/login'}
                  >Login</Button>
           </Box>

        </Toolbar>

    </AppBar>
  )
}
export default Header;
