import React, { useEffect, useState } from 'react';
import { Grid, InputLabel, MenuItem, Select, Snackbar, Alert, Button, Paper, Typography } from '@mui/material';
import axios from 'axios';

function StatsPage()
{
    const [selectedDate, setSelectedDate] = useState('');
    const [visits, setVisits] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);

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

    


    //uses the techID to find the assoicated tech name to display with listed visits
    function techName(techID)
    {
    for(var i = 0; i<technicians.length; i++)
    {
        if(technicians[i]._id == techID)
            return technicians[i].firstname + " " + technicians[i].lastname;
    }
    }
    //uses the custID to find the assoicated customer name to display with listed visits
    function custName(CustID)
    {
    for(var i = 0; i<customers.length; i++)
    {
        if(customers[i]._id == CustID)
            return customers[i].fname + " " + customers[i].lname;
    }
    }

    return (
        <div>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Grid item xs={6}>
                    <InputLabel id='dateLabel'>Date</InputLabel>
                    <input
                        type='datetime-local'
                        value={selectedDate}
                        onChange={handleDateChange}
                        style={{ width: '100%'}}
                        />
                </Grid>
            </Paper>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#f8f8f8' }}>
        <Typography variant="h5" style={{ marginBottom: '20px', color: '#1976d2' }}>
          Results
          </Typography>
        <ul>
          {visits.map((visit, index) => (
            <li key={index}>
              <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
               <strong>Date:</strong> {visit.date}, <strong>Customer:</strong> {custName(visit.customer)}
              </Typography>
              <ul>
                {visit.job.map((job, jobIndex) => (
                  <li key={jobIndex}>
                    <Typography variant="body2">
                    <strong>Technician:</strong> {techName(job.technician_id)}, <strong>Service:</strong> {job.job_id ? job.job_id.serviceName : job.service.serviceName}, <strong>Cost:</strong> {job.job_id ? job.job_id.serviceName: job.service.cost}
                    </Typography>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
            </Paper>
        </div>
    );
}

export default StatsPage;