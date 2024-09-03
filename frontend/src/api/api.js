import axios from "axios";

export const getLocationsData = async () => {
  try {
    const res = await axios.get("http://localhost:8080/parkingSpaces")
    return res

  } catch (err) {
    console.log(err)

  }
}
