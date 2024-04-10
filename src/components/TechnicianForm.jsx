import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const topServices = ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Engine Tune-up', 'Car Wash'];

function TechnicianForm() {
  const [technicianData, setTechnicianData] = useState({
    firstname: '',
    lastname: '',
  });
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5050/technicians')
      .then(response => {
        setTechnicians(response.data);
      })
      .catch(error => {
        console.error('Error fetching technicians:', error);
      });
  }, []);

  const handleChange = (e) => {
    setTechnicianData({
      ...technicianData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstname, lastname } = technicianData;
    if (!firstname || !lastname) {
      alert('Please fill in all required fields.');
      return;
    }
    const newTechnician = {
      firstname,
      lastname,
    };
    axios.post('http://localhost:5050/technicians', newTechnician)
      .then(response => {
        setTechnicians([...technicians, response.data]);
        setTechnicianData({
          firstname: '',
          lastname: '',
        });
      })
      .catch(error => {
        console.error('Error adding technician:', error);
        alert('Error adding technician. Please try again.');
      });
  };

  return (
    <Paper style={{ padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Add Technician
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstname"
              value={technicianData.firstname}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastname"
              value={technicianData.lastname}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Technician
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h5" component="h2" gutterBottom style={{ marginTop: '20px' }}>
        Technician List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {technicians.map((technician, index) => (
              <TableRow key={index}>
                <TableCell>{technician.firstname}</TableCell>
                <TableCell>{technician.lastname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TechnicianForm;
