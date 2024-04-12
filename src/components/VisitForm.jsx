import React, { useEffect, useState } from 'react';
import { Grid, InputLabel, MenuItem, Select, Snackbar, Alert, Button, Paper, Typography } from '@mui/material';
import axios from 'axios';

function VisitForm() {
  const [selectedDate, setSelectedDate] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertError, setAlertError] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [customerCar, setCustomerCar] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedServices, setSelectedServices] = useState(['']); // Initialize with one empty service field
  const [selectedTechnicians, setSelectedTechnicians] = useState(['']); // Initialize with one empty technician field
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [visits, setVisits] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await axios.get('http://localhost:5050/customers/');
        setCustomers(customerResponse.data);

        const serviceResponse = await axios.get('http://localhost:5050/services/');
        setServices(serviceResponse.data);

        const technicianResponse = await axios.get('http://localhost:5050/technicians/');
        setTechnicians(technicianResponse.data);

        const visitsResponse = await axios.get('http://localhost:5050/visit');
        setVisits(visitsResponse.data);
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
      setCars(data);
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
          return cars.find((car) => car._id === carId);
        });
        setCustomerCar(customerCars);
      })
      .catch((error) => {
        console.error('Error fetching customer cars:', error);
      });
    }
  }, [selectedCustomer]);

  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
    setSelectedCar('');
  };

  const handleCarChange = (event) => {
    setSelectedCar(event.target.value);
  };

  const handleServiceChange = (event, index) => {
    const newSelectedServices = [...selectedServices];
    newSelectedServices[index] = event.target.value;
    setSelectedServices(newSelectedServices);
    setSelectedTechnicians([...selectedTechnicians, '']); 
  };

  const handleTechnicianChange = (event, index) => {
    const newSelectedTechnicians = [...selectedTechnicians];
    newSelectedTechnicians[index] = event.target.value;
    setSelectedTechnicians(newSelectedTechnicians);
  };

  const addServiceField = () => {
    setSelectedServices([...selectedServices, '']);
    setSelectedTechnicians([...selectedTechnicians, '']);
  };

  const handleSubmit = async () => {
    try {
      const visitData = {
        customer_id: selectedCustomer,
        date: selectedDate,
        car_id: selectedCar,
        job: selectedServices.map((service, index) => ({
          // customer_id: selectedCustomer,
          // date: selectedDate,
          service: service,
          technician_id: selectedTechnicians[index]
        }))
      };
  
      const response = await axios.post('http://localhost:5050/visit', visitData);
  
      if (response.status === 200) {
        setShowAlert(true);
        setAlertMessage('Visit successfully added!');
        setAlertError(false);
      } else {
        setShowAlert(true);
        setAlertMessage('Failed to add visit.');
        setAlertError(true);
      }
    } catch (error) {
      console.error('Error adding visit:', error);
      setShowAlert(true);
      setAlertMessage('Error adding visit. Please try again later.');
      setAlertError(true);
    }
  };

  return (
    <div>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h4" style={{ marginBottom: '20px', color: '#1976d2' }}>
          Add Visit
        </Typography>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
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
          {selectedServices.map((service, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <InputLabel id={`serviceLabel-${index}`}>Service</InputLabel>
                <Select
                  fullWidth
                  labelId={`serviceLabel-${index}`}
                  value={service}
                  onChange={(event) => handleServiceChange(event, index)}
                >
                  {services.map((service) => (
                    <MenuItem key={service._id} value={service}>
                      {service.serviceName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6}>
                <InputLabel id={`technicianLabel-${index}`}>Technician</InputLabel>
                <Select
                  fullWidth
                  labelId={`technicianLabel-${index}`}
                  value={selectedTechnicians[index]}
                  onChange={(event) => handleTechnicianChange(event, index)}
                  disabled={!service}
                >
                  {technicians
                    .filter((technician) => service && service.technicians && service.technicians.includes(technician._id))
                    .map((technician) => (
                      <MenuItem key={technician._id} value={technician._id}>
                        {technician.firstname} {technician.lastname}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addServiceField}>
              Add Service
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add Visit
            </Button>
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
      </Paper>
      <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#f8f8f8' }}>
        <Typography variant="h5" style={{ marginBottom: '20px', color: '#1976d2' }}>
          Current Visits
        </Typography>
        <ul>
          {visits.map((visit, index) => (
            <li key={index}>
              <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                <strong>Customer:</strong> {visit.customer}, <strong>Date:</strong> {visit.date}
              </Typography>
              <ul>
                {visit.job.map((job, jobIndex) => (
                  <li key={jobIndex}>
                    <Typography variant="body2">
                      <strong>Service:</strong> {job.job_id ? job.job_id.serviceName : job.service_id.serviceName}, <strong>Technician:</strong> {job.technician_id}
                    </Typography>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Paper>
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
