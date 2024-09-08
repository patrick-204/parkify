import React from "react";
import { Box, Button } from "@material-ui/core";

import Booking from "../Booking/Booking";
import Message from "../Message/Message";

const PlaceDetails = ({parkingSpace}) => {

  return(
    <>

    <h1>{[parkingSpace.price]} $/hr  ({[parkingSpace.id]})</h1>
    <p>Owner: {[parkingSpace.name]}</p>

    <p>📞 {[parkingSpace.phone]} -
     ✉️ <a href={`mailto:${parkingSpace.email}`}>{parkingSpace.email}</a>
     </p>
    <p>{[parkingSpace.street_address]},{[parkingSpace.city]},{[parkingSpace.province]},</p>
    <p>{parkingSpace.isreserved
        ?"Currently no parking space avilable ❌"
        :"Currently Parking space avilable ✅"
        }   </p>


    <Box  display="flex"
          justifyContent="space-around"
          alignItems="center"
          flexDirection="row"
          p={2}
          bgcolor="background.paper" >
       <div><Booking bookingParkingSpaceId={parkingSpace.id} /></div>
       <div><Message /></div>
    </Box>

    </>
  )
}
export default PlaceDetails;
