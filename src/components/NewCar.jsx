import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Alert, MenuItem } from '@mui/material';
import axios from 'axios';

function NewCar() {
  const [carData, setCarData] = useState({
    model: '',
    licensePlate: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    fetchCars();
    fetchCustomers();
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

  const fetchCustomers = () => {
    axios.get('http://localhost:5050/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setAlertMessage('Error fetching customers: ' + error.message);
      });
  };

  const handleChange = (e) => {
    setCarData({
      ...carData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyFields = Object.keys(carData).filter(key => carData[key] === '');
    if (emptyFields.length > 0 || !selectedCustomer) {
      setErrorFields(emptyFields);
      setAlertMessage('Please fill in all required fields and select a customer.');
      return;
    }
    const newCarData = {
      ...carData,
      customerId: selectedCustomer,
    };
    axios.post('http://localhost:5050/cars', newCarData)
      .then(response => {
        setAlertMessage('Car added successfully');
        setCarData({
          model: '',
          licensePlate: '',
        });
        // setSelectedCustomer('');
        console.log(response);
        updateCustomerCars(selectedCustomer, response.data.insertedId);
        fetchCars(); 
        setSelectedCustomer('');
        setCarData({
          model: '',
          licensePlate: '',})
      })
      .catch(error => {
        console.error('Error adding car:', error);
        setAlertMessage('Error adding car: ' + error.message);
      });
  };
  
  function updateCustomerCars(cust, carId) {
    console.log(cust);
    console.log(carId);
    axios.get('http://localhost:5050/customers/' + cust)
      .then((response) => {
        console.log('Sucessfully fetched customer data')
        console.log(response);
        var carList = response.data.cars ? response.data.cars : [];
        console.log(carList);
        carList.push(carId);
        axios.patch('http://localhost:5050/customers/' + cust, {
          ...response.data,
          cars: carList
        })
          .then((response) => {
            console.log('Successfully Updated Cars')
          })
          .catch((error) => {
            console.error('Error patching data: ', error);
          })
      })
      .catch((error) => {
        console.log('Error Fetching Customer Data: ', error);
      })
  }

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
              select
              label="Select Customer"
              value={selectedCustomer}
              onChange={handleCustomerChange}
              fullWidth
              required
              error={!selectedCustomer}
            >
              {customers.map(customer => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.fname} {customer.lname}
                </MenuItem>
              ))}
            </TextField>
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
          <li key={car.id}>
            {car.model} - {car.licensePlate} (Customer: {car.customerId})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewCar;
