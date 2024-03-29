import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Chip, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';

function App() {
  const [integrationData, setIntData] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [selectedTechnicians, setSelectedTechs] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [technicians, setTechs] = useState([]);
  const [selectedServiceID] = useState();

  useEffect(() => {
    fetch('http://localhost:5050/technicians/', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setTechs(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [])

  useEffect(() => {
    fetchAllData(false);
  }, )

  useEffect(() => {
    console.log(technicians)
  }, [technicians])

  const fetchFitlerData = async () => {
    let url = 'http://localhost:5050/services/';
    if (filterValue !== "") {
      url += `?filter=${filterValue}`;
    }
    await fetch(url, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        if (filterValue !== "") {
          const filteredData = data.filter(item => item._id === filterValue);
          setIntData(filteredData);
        } else {
          setIntData(data);
        }
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const fetchAllData = async (setIntData) => {
    await fetch('http://localhost:5050/services/', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
        console.log(data);
        if (setIntData)
          setIntData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const postData = async () => {
    await fetch ('http://localhost:5050/services/', {
      method: 'POST',
      body: JSON.stringify({
        serviceName: serviceName,
        cost: serviceCost,
        technicians: selectedTechnicians
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => {
      console.log(err.message)
    })
  }

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      }
    }
  }

  return (
    <Grid container spacing ={3} style={{width:'50vw', height:'75vh', marginLeft:'25vw', marginTop:'12.5vh'}}>
      <Grid item xs={8}>
        <Select

        >

        </Select>
      </Grid>
      <Grid item xs={6}>
        <TextField 
          fullWidth
          variant='outlined' 
          label='Service Name' 
          value={serviceName}
          onChange={(event) => {
            setServiceName(event.target.value)
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField 
          fullWidth
          variant='outlined' 
          label='Service Cost' 
          value={serviceCost}
          onChange={(event) => {
            setServiceCost(event.target.value)
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <InputLabel id='techSelectBox'>Qualified Techs</InputLabel>
        <Select
          labelId='techSelectBox'
          id='techSelect'
          multiple
          value={selectedTechnicians}
          onChange={(event) => {
            setSelectedTechs(event.target.value);
            console.log(event.target.value);
          }}  
          fullWidth
          MenuProps={MenuProps}
          input={<OutlinedInput id='select-multiple-chip' label='chip'/>}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {technicians.map((tech) => (
            <MenuItem key={tech['firstname']} value={tech['_id']}>
              {tech.firstname + " " + tech.lastname}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item xs={4}>
        <Button 
          fullWidth
          variant='contained'
          onClick={() => {
            postData();
          }}
        >
          Add Data
        </Button>
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          variant='outlined'
          label='Filter'
          value={filterValue}
          onChange={(event) => {
            setFilterValue(event.target.value)
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Button
          variant='contained'
          onClick={() => {
            fetchFitlerData();
          }}
        >
          Get Fitler Data
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant='contained'
          onClick={() => {
            fetchAllData(true);
          }}
        >
          Get All Data
        </Button>
      </Grid>
      <Grid item xs={12}>
        <pre>
          {integrationData ? JSON.stringify(integrationData, null, 2) : {}}
        </pre>
      </Grid>
    </Grid>
  )
}

export default App;
