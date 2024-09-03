import React, { useEffect,useState } from "react";
import {CssBaseline, Grid } from '@material-ui/core'

import { getLocationsData } from "./api/api";
import Header from "./components/Header/Header"
import List from "./components/List/List"
import Map from "./components/Map/Map"



const App = () => {
  const [postalCodes, setPostalCodes] = useState([]);
  const [parkingSpaces,setParkingSpaces] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null);


  useEffect(() => {
    getLocationsData()
      .then((data) => {
        const response =data.data.parkingSpaces
        // console.log(data.data.parkingSpaces);
        // console.log(response.map(code => {code.location}))
        setParkingSpaces(response);
      })
  },[])

  useEffect(()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation({lat:latitude, lng:longitude});
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );

    }else {
      console.log("Geolocation is not supported by this browser")
    }
  },[]);



  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{width:'100%'}}>
        <Grid  item xs={12} md={4}>
              <List />
        </Grid>
        <Grid  item xs={12} md={8}>
              <Map parkingSpaces={parkingSpaces} currentLocation={currentLocation}/>
        </Grid>

      </Grid>
    </>
  )
}
export default App;
