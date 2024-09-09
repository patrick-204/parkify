// src/CustomMarker.js
import React from 'react';
import { Marker } from '@react-google-maps/api';

const CustomMarker = ({ position, onHover, label }) => {
  const handleMouseOver = () => onHover(label);

  return (
    <Marker
      position={position}

      onMouseOver={handleMouseOver}
      label={{
        text: label,
        color: 'black', // Adjust label color if necessary
        fontSize: '14px',
        fontWeight: 'bold',
      }}
    />
  );
};

export default CustomMarker;
