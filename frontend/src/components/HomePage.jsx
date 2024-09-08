import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Header from '../components/Header/Header';
import List from '../components/List/List';
import Map from '../components/Map/Map';

const HomePage = ({ isLoggedIn, onLogout, parkingSpaces, currentLocation, currentPath, onHeaderLoad }) => {
  return (
    <>
      <CssBaseline />
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} currentPath={currentPath} onHeaderLoad={onHeaderLoad} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List isLoggedIn={isLoggedIn} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map parkingSpaces={parkingSpaces} currentLocation={currentLocation} />
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
