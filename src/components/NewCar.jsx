import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Alert, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

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
        setSelectedCustomer('');
        fetchCars(); 
        axios.get(`http://localhost:5050/customers/${selectedCustomer}`)
          .then(customerResponse => {
            const existingCustomerData = customerResponse.data;
            const updatedCars = [...(existingCustomerData.cars || []), response.data.model]; 
            axios.patch(`http://localhost:5050/customers/${selectedCustomer}`, {
              ...existingCustomerData, 
              cars: updatedCars
            })
            .then(() => {
              console.log('Customer cars updated successfully');
            })
            .catch(error => {
              console.error('Error updating customer cars:', error);
              setAlertMessage('Error updating customer cars: ' + error.message);
            });
          })
          .catch(error => {
            console.error('Error fetching customer data:', error);
            setAlertMessage('Error fetching customer data: ' + error.message);
          });
      })
      .catch(error => {
        console.error('Error adding car:', error);
        setAlertMessage('Error adding car: ' + error.message);
      });
  };

  const handleDeleteConfirmationOpen = (car) => {
    setCarToDelete(car);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteCar = () => {
    if (carToDelete) {
      axios.delete(`http://localhost:5050/cars/${carToDelete._id}`)
        .then(() => {
          setAlertMessage('Car deleted successfully');
          fetchCars();
          setDeleteConfirmationOpen(false);
        })
        .catch(error => {
          console.error('Error deleting car:', error);
          setAlertMessage('Error deleting car: ' + error.message);
          setDeleteConfirmationOpen(false);
        });
    }
  };

  return (
    <Paper style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
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
      <Grid container spacing={2}>
        {cars.map(car => (
          <Grid item xs={12} sm={6} key={car._id}>
            <Paper style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '5px', border: '1px solid #e0e0e0' }}>
              <Typography variant="body1" gutterBottom>
                {car.model} - {car.licensePlate} (Customer: {car.customerId})
              </Typography>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteConfirmationOpen(car)}>
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this car?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCar} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default NewCar;
