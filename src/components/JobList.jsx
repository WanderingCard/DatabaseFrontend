import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceCount from './ServiceCount';
import { TextField, Button, Grid, Typography, Select, MenuItem, InputLabel, List, ListItem, ListItemText, Alert } from '@mui/material';

const topServices = ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Engine Tune-up', 'Car Wash'];

function JobList() {
  const [jobData, setJobData] = useState({
    car: '',
    service: '',
    date: '',
    technician: '',
    status: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [cars, setCars] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [fetchJobs, setFetchJobs] = useState(false);
  const [techniciansWithNoJobs, setTechniciansWithNoJobs] = useState([]);

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
        // Filter technicians with no jobs
        const techniciansWithJobs = filteredJobs.map(job => job.technician);
        const techniciansWithoutJobs = response.data.filter(tech => !techniciansWithJobs.includes(tech.id));
        setTechniciansWithNoJobs(techniciansWithoutJobs);
      })
      .catch(error => {
        console.error('Error fetching technicians:', error);
      });
  }, [filteredJobs]);

  const handleChange = (e) => {
    if (e.target.name === 'car') {
      const selectedCar = cars.find(car => car.id === e.target.value);
      setJobData({
        ...jobData,
        car: selectedCar ? selectedCar.id : '', // Set the car ID
      });
    } else {
      setJobData({
        ...jobData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyFields = Object.keys(jobData).filter(key => jobData[key] === '');
    if (emptyFields.length > 0) {
      setErrorFields(emptyFields);
      setAlertMessage('Please fill in all required fields.');
      return;
    }
    axios.post('http://localhost:5050/jobs', jobData)
      .then(response => {
        setAlertMessage('Job added successfully.');
        setJobData({
          car: '',
          service: '',
          date: '',
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
    if (filterDate && fetchJobs) {
      axios.get(`http://localhost:5050/jobs?date=${filterDate}`)
        .then(response => {
          setFilteredJobs(response.data);
          setAlertMessage(response.data.length === 0 ? 'No jobs found for the selected date' : '');
          setFetchJobs(false);
        })
        .catch(error => {
          console.error('Error fetching jobs for the given date:', error);
          setAlertMessage('Error fetching jobs for the given date');
          setFilteredJobs([]);
          setFetchJobs(false);
        });
    }
  }, [filterDate, fetchJobs]);

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
    setFetchJobs(true); // Set to true to fetch jobs when date is changed
  };

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
              {topServices.map(service => (
                <MenuItem key={service} value={service}>
                  {service}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Date</InputLabel>
            <TextField
              type="date"
              name="date"
              value={jobData.date}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('date')}
            />
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
                <MenuItem key={technician._id} value={technician.firstname}>
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
          <Grid item xs={12} sm={6}>
            <InputLabel>Date Filter</InputLabel>
            <TextField
              type="date"
              label=""
              value={filterDate}
              onChange={handleDateChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ServiceCount topServices={topServices} />
          </Grid>
        </Grid>
      </form>
      {techniciansWithNoJobs.length > 0 && (
        <div>
          <Typography variant="h4" component="h2" gutterBottom>
            Technicians With No Jobs
          </Typography>
          <List>
            {techniciansWithNoJobs.map(technician => (
              <ListItem key={technician._id}>
                <ListItemText primary={`${technician.firstname} ${technician.lastname}`} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
      {filteredJobs.length > 0 && (
        <div>
          <Typography variant="h4" component="h2" gutterBottom>
            Jobs for Selected Date
          </Typography>
          <List>
            {filteredJobs.map(job => (
              <ListItem key={job.id} style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
                <ListItemText primary={`${job.car.model} - ${job.car.licensePlate} - ${job.service}`} secondary={`Date: ${job.date}, Technician: ${job.technician.firstname} ${job.technician.lastname}, Status: ${job.status}`} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
      {alertMessage && <Alert severity="info">{alertMessage}</Alert>}
    </div>
  );
}

export default JobList;
