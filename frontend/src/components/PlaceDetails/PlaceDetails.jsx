import React from "react";
import { Box, Button } from "@material-ui/core";

import Booking from "../Booking/Booking";
import Message from "../Message/Message";
import { useEffect } from "react";

const PlaceDetails = ({ parkingSpace, isLoggedIn, selected, refProp }) => {

  useEffect(() => {
    if (selected && refProp?.current) {
      refProp.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected, refProp]);
  return(
    <>

    <h1>{[parkingSpace.price]} $/hr  ({[parkingSpace.id]})</h1>
    <p>Owner: {[parkingSpace.name]}</p>

    <p>📞 {[parkingSpace.phone]} -
     ✉️ <a href={`mailto:${parkingSpace.email}`}>{parkingSpace.email}</a>
     </p>
    <p>{[parkingSpace.street_address]},{[parkingSpace.city]},{[parkingSpace.province]},</p>

    {isLoggedIn ? (
      <Box  display="flex"
            justifyContent="space-around"
            alignItems="center"
            flexDirection="row"
            p={2}
            bgcolor="background.paper" >

        <div><Booking bookingParkingSpaceId={parkingSpace.id} /></div>
        <div><Message /></div>

      </Box>
    ) : null}

    </>
  )
}
export default PlaceDetails;
