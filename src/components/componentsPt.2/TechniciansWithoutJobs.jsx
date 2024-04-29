import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

function TechniciansWithVisits() {
  const [techniciansWithVisits, setTechniciansWithVisits] = useState([]);
  const [techniciansWithoutVisits, setTechniciansWithoutVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5050/technicians')
      .then(techniciansResponse => {
        axios.get('http://localhost:5050/visit')
          .then(visitsResponse => {
            const visits = visitsResponse.data;
            const technicianIdsInVisits = new Set(visits.flatMap(visit => visit.job.map(job => job.technician_id)));

            const technicians = techniciansResponse.data;
            const techniciansWithVisits = [];
            const techniciansWithoutVisits = [];

            technicians.forEach(tech => {
              if (technicianIdsInVisits.has(tech._id)) {
                techniciansWithVisits.push(tech);
              } else {
                techniciansWithoutVisits.push(tech);
              }
            });

            setTechniciansWithVisits(techniciansWithVisits);
            setTechniciansWithoutVisits(techniciansWithoutVisits);
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
      {loading && <CircularProgress />}
      {!loading && (
        <div>
          <Typography variant="h4" component="h2" gutterBottom>
            Technicians With Visits
          </Typography>
          <List>
            {techniciansWithVisits.map((technician, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${technician.firstname} ${technician.lastname}`} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h4" component="h2" gutterBottom>
            Technicians Without Visits
          </Typography>
          <List>
            {techniciansWithoutVisits.map((technician, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${technician.firstname} ${technician.lastname}`} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}

export default TechniciansWithVisits;
