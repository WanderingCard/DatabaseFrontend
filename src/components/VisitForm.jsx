import React, { useEffect, useState } from 'react';
import { Grid, InputLabel, MenuItem, Select, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function VisitForm() {
  const [selectedDate, setSelectedDate] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertError, setAlertError] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerCar, setCustomerCar] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await axios.get('http://localhost:5050/customers/');
        setCustomers(customerResponse.data);

        const serviceResponse = await axios.get('http://localhost:5050/services/');
        setServices(serviceResponse.data);

        const technicianResponse = await axios.get('http://localhost:5050/technicians/');
        setTechnicians(technicianResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  useEffect(() => {
    fetch('http://localhost:5050/cars/', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((data) => {
      setCustomerCar(data);
    })
    .catch((error) => {
      console.error('Error fetching cars:', error);
    });
  }, []);

  useEffect(() => {
    if(selectedCustomer !== '') {
      fetch(`http://localhost:5050/customers/${selectedCustomer}`, {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((data) => {
        const customerCarIds = data.cars;
        const customerCars = customerCarIds.map((carId) => {
          return customerCar.find((car) => car._id === carId);
        });
        setCustomerCar(customerCars);
      })
      .catch((error) => {
        console.error('Error fetching customer cars:', error);
      });
    }
  }, [selectedCustomer, customerCar]);

  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
    setSelectedCar('');
  };

  const handleCarChange = (event) => {
    setSelectedCar(event.target.value);
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    setSelectedTechnician('');
  };

  const handleTechnicianChange = (event) => {
    setSelectedTechnician(event.target.value);
  };

  const handleSubmit = () => {
    // Handle form submission here
  };

  return (
    <div>
      <Grid container spacing={3} style={{ width: '50vw', height: '75vh', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', marginTop: '20px'}}>
        <Grid item xs={6}>
          <InputLabel id='customerLabel'>Customer</InputLabel>
          <Select
            fullWidth
            labelId='customerLabel'
            value={selectedCustomer}
            onChange={handleCustomerChange}
          >
            {customers.map((customer) => (
              <MenuItem key={customer._id} value={customer._id}>
                {customer.fname} {customer.lname}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <InputLabel id='carLabel'>Car</InputLabel>
          <Select
            fullWidth
            labelId='carLabel'
            value={selectedCar}
            onChange={handleCarChange}
          >
            {customerCar.map((car) => (
              <MenuItem key={car._id} value={car._id}>
                {car.model} - {car.licensePlate}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <InputLabel id='serviceLabel'>Services</InputLabel>
          <Select
            fullWidth
            labelId='serviceLabel'
            value={selectedService}
            onChange={handleServiceChange}
          >
            {services.map((service) => (
              <MenuItem key={service._id} value={service}>
                {service.serviceName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <InputLabel id='technicianLabel'>Technician</InputLabel>
          <Select
            fullWidth
            labelId='technicianLabel'
            value={selectedTechnician}
            onChange={handleTechnicianChange}
            disabled={!selectedService}
          >
            {selectedService &&
              technicians
                .filter((technician) => selectedService && selectedService.technicians && selectedService.technicians.includes(technician._id))
                .map((technician) => (
                  <MenuItem key={technician._id} value={technician._id}>
                    {technician.firstname} {technician.lastname}
                  </MenuItem>
                ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <InputLabel id='dateLabel'>Date of Service</InputLabel>
          <input
            type='date'
            value={selectedDate}
            onChange={handleDateChange}
            style={{ width: '100%' }}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={showAlert}
        onClose={handleClose}
        autoHideDuration={6000}
      >
        <Alert
          onClose={handleClose}
          severity={alertError ? 'error' : 'success'}
          variant='filled'
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default VisitForm;
