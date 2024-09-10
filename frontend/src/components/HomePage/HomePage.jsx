import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Header from '../Header/Header';
import List from '../List/List';
import Map from '../Map/Map';

const HomePage = ({ isLoggedIn, onLogout, parkingSpaces, currentLocation, currentPath, onHeaderLoad, onLogin,setChildHovered, childHovered }) => {
  return (
    <>
      <CssBaseline />
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} currentPath={currentPath} onHeaderLoad={onHeaderLoad} onLogin={onLogin} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List isLoggedIn={isLoggedIn} childHovered={childHovered} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map parkingSpaces={parkingSpaces} currentLocation={currentLocation} setChildHovered={setChildHovered} />
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
