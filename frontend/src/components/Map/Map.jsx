// src/MapContainer.js
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const mapContainerStyle = {
  height: '400px',
  width: '100%',
};



const MapContainer = ({ parkingSpaces,currentLocation }) => {
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);

  const center = currentLocation ? {
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  } : { lat: 0, lng: 0 };

  const handleLoad = useCallback((map) => setMap(map), []);
  console.log(parkingSpaces)
  const spaces = parkingSpaces.map(row => row.location)
  console.log(spaces)
  const parkingIds = parkingSpaces.map(row => row.id)
  console.log(parkingIds)

  useEffect(() => {
    const geocodePostalCodes = async () => {
      const geocodePromises = spaces.map(async (postalCode) => {
        console.log(postalCode)
        const apiKey = 'AIzaSyBctm5ncE9Kca9t8AM4hYe2-w2nIl6jitg';
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${apiKey}`;

        try {
          const response = await axios.get(geocodeUrl);
          if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry.location;
            return { lat, lng };
          }
        } catch (error) {
          console.error('Geocode error:', error);
        }
        return null;
      });

      const results = await Promise.all(geocodePromises);
      setMarkers(results.filter(location => location !== null));
    };

    if (spaces.length > 0) {
      geocodePostalCodes();
    }
  },[parkingSpaces]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBctm5ncE9Kca9t8AM4hYe2-w2nIl6jitg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={handleLoad}
      >

        {markers.map((position, index) => (
          <Marker key={index} position={position} label={`${parkingIds[index]}`} />
        ))}
        {currentLocation && (
          <Marker
            position={center}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
            label={"You are here"}/>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
