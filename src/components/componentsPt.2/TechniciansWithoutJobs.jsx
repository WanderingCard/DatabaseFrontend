import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

function TechniciansWithVisits() {
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5050/technicians')
      .then(techniciansResponse => {
        axios.get('http://localhost:5050/visit')
          .then(visitsResponse => {
            const technicians = techniciansResponse.data;
            const visits = visitsResponse.data;
            const mergedData = visits.map(visit => {
              const technician = technicians.find(tech => tech._id === visit.technician_id);
              return {
                ...visit,
                technician: technician ? technician : { firstname: 'Unknown', lastname: 'Technician' } // Handle case when technician is not found
              };
            });

            setMergedData(mergedData);
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
      {!loading && mergedData.length === 0 && <Alert severity="info">No data available</Alert>}
      {!loading && mergedData.length > 0 && (
        <div>
          <Typography variant="h4" component="h2" gutterBottom>
            Technicians With Visits
          </Typography>
          <List>
            {mergedData.map((data, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${data.technician.firstname} ${data.technician.lastname}`} secondary={`Visited on: ${data.date}`} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}

export default TechniciansWithVisits;
