import React,{useState,useEffect,createRef} from "react";
import axios from "axios";
import { CircularProgress,Grid,Typography,InputLabel,MenuItem,FormControl, Select } from "@material-ui/core";
import useStyles from './styles'
import PlaceDetails from '../PlaceDetails/PlaceDetails'

const List = ({ isLoggedIn,childHovered }) => {
  const classes=useStyles();
  console.log({childHovered})
  const [type,setType] = useState('parking')
  const [rating,setRating] = useState('')

  const [users,setUsers] = useState([]);
  const [elRefs, setElRefs] = useState();

  useEffect(()=> {
    const fetchAllParkingSpaces = async () => {
      try{
        const res = await axios.get("http://localhost:8080/users")
        setUsers(res.data.users)
      }catch(err){
        console.log(err)
      }
    }
    fetchAllParkingSpaces()
  },[])

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const refs = Array(users.length).fill().map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [users]);


  return(
      <div className={classes.container}>
        <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom:"40px"}} >
          Parking Spaces</Typography>
        {/* <FormControl className={classes.formControl}>
          <InputLabel>Order</InputLabel>
          <Select value={type} onChange={(e)=> setType(e.target.value)}>
            <MenuItem value="parking">Parking</MenuItem>


          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Rating</InputLabel>
          <Select value={rating} onChange={(e)=> setRating(e.target.value)}>
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={3}>Above 3.0</MenuItem>
            <MenuItem value={4}>Above 4.0</MenuItem>
            <MenuItem value={4.5}>Above 4.5</MenuItem>

          </Select>
        </FormControl> */}
        <Grid container spacing={3} className={classes.list} >
          {users?.map((parkingSpace,i) =>(
            <Grid
                  ref={elRefs[i]}
                  item
                  key={i}
                  xs={12}
                  style={{
                    backgroundColor: i % 2 === 0 ? '#ecece7' : '#b8b8b8',
                  }}

                  >
              <PlaceDetails
                  parkingSpace={parkingSpace}
                  isLoggedIn={isLoggedIn}
                  selected={Number(childHovered) === i+1}
                  refProp ={elRefs[i]}
                  />
            </Grid>
          ))}


        </Grid>

      </div>
    )
}
export default List;
