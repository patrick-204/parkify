import React from "react";

const PlaceDetails = ({parkingSpace}) => {

  return(
    <>

    <h1>{[parkingSpace.price]}$/hr - {[parkingSpace.id]}</h1>
    <p>Owner: {[parkingSpace.name]} <span><button>Book</button><button>Message</button></span></p>
    <p>📞 {[parkingSpace.phone]} - ✉️ {[parkingSpace.email]}</p>{}
    <p>{[parkingSpace.street_address]},{[parkingSpace.city]},{[parkingSpace.province]},</p>
    <p>{parkingSpace.isreserved
        ?"Currently Parking space avilable ✅"
        :"Currently no parking space avilable ❌"
        }   </p>

    </>
  )
}
export default PlaceDetails;
