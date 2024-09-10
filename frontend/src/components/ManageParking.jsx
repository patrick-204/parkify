import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageParking = ({ isLoggedIn }) => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    location: '',
    streeAddress: '',
    city: '',
    province: '',
    price: ''
  });
  const [errors, setErrors] = useState([]);

  // If the user is already logged in then redirect to homepage
  if (isLoggedIn) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation
    const errors = [];
    if (!formData.name.trim()) errors.push('Name is required.');
    if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      errors.push('A valid email is required.');
    }
    if (!formData.password || formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      errors.push('Phone number must be a 10-digit number.');
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || ['Internal Server Error']);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors(["Internal Server Error"]);
    }
  };

  return (
    <div>
      <h1>Register</h1>
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
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        </div>
        <div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        </div>
        <div>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone number" />
        </div>
        <button type="submit">Register</button>
        <a href="/">Cancel</a>
      </form>
    </div>
  );
};

export default ManageParking;
