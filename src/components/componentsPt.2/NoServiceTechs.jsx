import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Alert } from '@mui/material';

function NoServiceTechs() {
  const [techniciansWithNoJobs, setTechniciansWithNoJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5050/technicians')
      .then(response => {
        const formattedTechnicians = response.data.map(tech => ({
          id: tech._id,
          name: `${tech.firstname} ${tech.lastname}`
        }));
        axios.get('http://localhost:5050/visits')
          .then(visitsResponse => {
            const techniciansWithJobs = visitsResponse.data.flatMap(visit => visit.job.map(job => job.technician_id));
            const techniciansWithoutJobs = formattedTechnicians.filter(tech => !techniciansWithJobs.includes(tech.id));
            setTechniciansWithNoJobs(techniciansWithoutJobs);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching visits:', error);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching technicians:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading && <Typography variant="h4" component="h2" gutterBottom>Loading...</Typography>}
      {!loading && techniciansWithNoJobs.length === 0 && (
        <Typography variant="h4" component="h2" gutterBottom>No technicians found without jobs</Typography>
      )}
      {!loading && techniciansWithNoJobs.length > 0 && (
        <div>
          <Typography variant="h4" component="h2" gutterBottom>
            Technicians With No Jobs
          </Typography>
          <List>
            {techniciansWithNoJobs.map((technician, index) => (
              <ListItem key={index}>
                <ListItemText primary={technician.name} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}

export default NoServiceTechs;