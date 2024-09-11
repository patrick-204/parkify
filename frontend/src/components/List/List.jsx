
import React, { useState, useEffect, createRef } from "react";
import axios from "axios";
import { Grid, Typography } from "@material-ui/core";
import useStyles from './styles';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

const List = ({ isLoggedIn, childHovered }) => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [elRefs, setElRefs] = useState([]);

  useEffect(() => {
    const fetchAllParkingSpaces = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users");
        setUsers(res.data.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllParkingSpaces();
  }, []);

  useEffect(() => {
    const refs = Array(users.length).fill().map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [users]);

  return (
    <div className={classes.container}>
      <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: "40px" }}>
        Parking Spaces
      </Typography>

      <Grid container spacing={3} className={classes.list}>
        {users?.map((parkingSpace, i) => (
          <Grid
            ref={elRefs[i]}
            item
            key={i}
            xs={12}
            style={{
              backgroundColor: Number(childHovered) === parkingSpace.id ? '#f21b1b' : i % 2 === 0 ? '#ecece7' : '#b8b8b8',
              transition: 'background-color 0.3s',
            }}
          >
            <PlaceDetails
              parkingSpace={parkingSpace}
              isLoggedIn={isLoggedIn}
              selected={Number(childHovered) === parkingSpace.id}
              refProp={elRefs[i]}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default List;
