import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Alert } from '@mui/material';
import axios from 'axios';

function NewCar() {
  const [carData, setCarData] = useState({
    model: '',
    licensePlate: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    axios.get('http://localhost:5050/cars')
      .then(response => {
        setCars(response.data);
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
        setAlertMessage('Error fetching cars: ' + error.message);
      });
  };

  const handleChange = (e) => {
    setCarData({
      ...carData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyFields = Object.keys(carData).filter(key => carData[key] === '');
    if (emptyFields.length > 0) {
      setErrorFields(emptyFields);
      setAlertMessage('Please fill in all required fields.');
      return;
    }
    axios.post('http://localhost:5050/cars', carData)
      .then(response => {
        setAlertMessage('Car added successfully');
        setCarData({
          model: '',
          licensePlate: '',
        });
        fetchCars(); 
      })
      .catch(error => {
        console.error('Error adding car:', error);
        setAlertMessage('Error adding car: ' + error.message);
      });
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        New Car Form
      </Typography>
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Model"
              name="model"
              value={carData.model}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('model')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="License Plate"
              name="licensePlate"
              value={carData.licensePlate}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('licensePlate')}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Car
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h6" component="h3" gutterBottom style={{ marginTop: '20px' }}>
        Cars
      </Typography>
      <ul>
        {cars.map(car => (
          <li key={car.id}>{car.model} - {car.licensePlate}</li>
        ))}
      </ul>
    </div>
  );
}

export default NewCar;
