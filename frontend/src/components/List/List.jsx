import React,{useState,useEffect} from "react";
import axios from "axios";
import { CircularProgress,Grid,Typography,InputLabel,MenuItem,FormControl, Select } from "@material-ui/core";
import useStyles from './styles'
import PlaceDetails from '../PlaceDetails/PlaceDetails'
const places = [
  {name:'Parkings 1'},
  {name:'Parkings 2'},
  {name:'Parkings 3'},
  {name:'Parkings 4'},
  {name:'Parkings 5'},
  {name:'Parkings 6'},
  {name:'Parkings 7'},
  {name:'Parkings 8'},
  {name:'Parkings 9'},
  {name:'Parkings 10'},
  {name:'Parkings 11'},

];

const List = () => {
  const classes=useStyles();

  const [type,setType] = useState('parking')
  const [rating,setRating] = useState('')

  const [users,setUsers] = useState([]);

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



  return(
      <div className={classes.container}>
        <Typography variant="h4">Parking Spaces</Typography>
        <FormControl className={classes.formControl}>
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
        </FormControl>
        <Grid container spacing={3} className={classes.list}>
          {users?.map((parkingSpace,i) =>(
            <Grid item key={i} xs={12}>
              <PlaceDetails parkingSpace={parkingSpace}/>
            </Grid>
          ))}


        </Grid>

      </div>
    )
}
export default List;
