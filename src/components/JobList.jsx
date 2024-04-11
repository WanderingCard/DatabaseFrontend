import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Select, MenuItem, InputLabel, Alert } from '@mui/material';

function JobList() {
  const [jobData, setJobData] = useState({
    car: '',
    service: '',
    technician: '',
    status: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [cars, setCars] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [services, setServices] = useState([]);
  const [fetchJobs, setFetchJobs] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5050/cars')
      .then(response => {
        setCars(response.data);
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5050/technicians')
      .then(response => {
        setTechnicians(response.data);
      })
      .catch(error => {
        console.error('Error fetching technicians:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5050/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  }, []);

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyFields = Object.keys(jobData).filter(key => jobData[key] === '');
    if (emptyFields.length > 0) {
      setErrorFields(emptyFields);
      setAlertMessage('Please fill in all required fields.');
      return;
    }
    axios.post('http://localhost:5050/jobs', {
      car_id: jobData.car,
      service_id: jobData.service,
      technician_id: jobData.technician,
      status: jobData.status
    })
      .then(response => {
        setAlertMessage('Job added successfully.');
        setJobData({
          car: '',
          service: '',
          technician: '',
          status: '',
        });
        setFetchJobs(true);
      })
      .catch(error => {
        console.error('Error adding job:', error);
        setAlertMessage('Error adding job: ' + error.message);
      });
  };

  useEffect(() => {
    if (fetchJobs) {
      axios.get('http://localhost:5050/jobs')
        .then(response => {
          // Handle the fetched jobs as needed
          setFetchJobs(false);
        })
        .catch(error => {
          console.error('Error fetching jobs:', error);
        });
    }
  }, [fetchJobs]);

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Add Job
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InputLabel>Car</InputLabel>
            <Select
              name="car"
              value={jobData.car}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('car')}
            >
              <MenuItem value="" disabled>
                Select a car
              </MenuItem>
              {cars.map(car => (
                <MenuItem key={car._id} value={car._id}>
                  {car.model} - {car.licensePlate}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Service</InputLabel>
            <Select
              name="service"
              value={jobData.service}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('service')}
            >
              <MenuItem value="" disabled>
                Select a service
              </MenuItem>
              {services.map(service => (
                <MenuItem key={service._id} value={service._id}>
                  {service.serviceName} - ${service.cost}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Technician</InputLabel>
            <Select
              name="technician"
              value={jobData.technician}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('technician')}
            >
              <MenuItem value="" disabled>
                Select a technician
              </MenuItem>
              {technicians.map(technician => (
                <MenuItem key={technician._id} value={technician._id}>
                  {technician.firstname} {technician.lastname}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Status</InputLabel>
            <TextField
              name="status"
              value={jobData.status}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('status')}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Job
            </Button>
          </Grid>
        </Grid>
      </form>
      {alertMessage && <Alert severity="info">{alertMessage}</Alert>}
    </div>
  );
}

export default JobList;
