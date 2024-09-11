import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ManageParking = ({ isLoggedIn }) => {
  const navigate = useNavigate(); 
  const { ownerId } = useParams(); 
  const [formData, setFormData] = useState({
    location: '',
    streetAddress: '',
    city: '',
    province: '',
    price: ''
  });
  const [errors, setErrors] = useState([]);
  const [parkingSpaces, setParkingSpaces] = useState([]); 

  useEffect(() => {
    const fetchParkingSpaces = async () => {
      try {
        const response = await fetch(`http://localhost:8080/parkingSpaces/parking-space/spaces`, {
          method: 'GET',
          credentials: 'include' 
        });

        if (response.ok) {
          const data = await response.json();
          setParkingSpaces(data.parkingSpaces);
        } else {
          const errorData = await response.json();
          setErrors(errorData.errors || ['Internal Server Error']);
        }
      } catch (error) {
        console.error("Error fetching parking spaces:", error);
        setErrors(["Internal Server Error"]);
      }
    };

    fetchParkingSpaces();
  }, [ownerId]); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!formData.location.trim()) errors.push('Location is required.');
    if (!formData.streetAddress.trim()) errors.push('Street Address is required.');
    if (!formData.city.trim()) errors.push('City is required.');
    if (!formData.province.trim()) errors.push('Province is required.');
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.push('Price must be a positive number.');
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/parkingSpaces/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok) {
        const updatedResponse = await fetch(`http://localhost:8080/parkingSpaces/parking-space/spaces`, {
          method: 'GET',
          credentials: 'include'
        });

        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setParkingSpaces(data.parkingSpaces);
        }

        setFormData({
          location: '',
          streetAddress: '',
          city: '',
          province: '',
          price: ''
        });
        setErrors([]);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || ['Internal Server Error']);
      }
    } catch (error) {
      console.error("Error while adding parking space:", error);
      setErrors(["Internal Server Error"]);
    }
  };

  return (
    <div>
      <h1>Manage Parking Spaces</h1>
      {errors.length > 0 && (
        <div className="errors">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Postal Code"
          />
        </div>
        <div>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="Street Address"
          />
        </div>
        <div>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            placeholder="Province"
          />
        </div>
        <div>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />
        </div>
        <button type="submit">Add Parking Space</button>
        <a href="/">Cancel</a>
      </form>

      <h2>Your Parking Spaces</h2>
      <table>
        <thead>
          <tr>
            <th>Postal Code</th>
            <th>Street Address</th>
            <th>City</th>
            <th>Province</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {parkingSpaces.length > 0 ? (
            parkingSpaces.map((space, index) => (
              <tr key={index}>
                <td>{space.location}</td>
                <td>{space.street_address}</td>
                <td>{space.city}</td>
                <td>{space.province}</td>
                <td>{space.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No parking spaces found for the user.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageParking;
