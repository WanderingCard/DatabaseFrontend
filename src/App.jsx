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
  const [selectedServiceID, setSelectedService] = useState("");
  const [selectedTechNames, setSelectedTechNames] = useState([]);

  async function getTechName(techID) {
    await fetch('http://localhost:5050/technicians/' + techID, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.firstname + ' ' + data.lastname)
        return (data.firstname + ' ' + data.lastname);
      })
  }

  async function postService() {
    var url = 'http://localhost:5050/services/'
    var method = selectedServiceID === 'Add New Service' ? 'POST' : 'PATCH'
    console.log(method);
    if (selectedServiceID !== 'Add New Service') {
      url += selectedServiceID
    }
    await fetch(url, {
      method: method,
      body: JSON.stringify({
        serviceName: serviceName,
        cost: serviceCost,
        technicians: selectedTechnicians
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((err) => {
        console.log(err.message)
      })
  }

  useEffect(() => {
    var names = []
    if (selectedTechnicians.length !== 0) {
      console.log('Selected Techs: ' + selectedTechnicians)
      selectedTechnicians.forEach((tech) => {
        console.log('tech: ' + tech)
        var indexTech = technicians.findIndex(techy =>
          tech === techy._id
        )
        console.log(indexTech);
        var techInfo = technicians[indexTech];
        console.log(techInfo);
        var techName = techInfo['firstname'] + ' ' + techInfo['lastname'];
        names.push(techName)
      })
      console.log(names);
      setSelectedTechNames(names);
    }
  }, [selectedTechnicians])

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
  }, [])

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
    await fetch('http://localhost:5050/services/', {
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

  useEffect(() => {
    console.log(selectedServiceID)
    // Set all fields to current value of the service
    if (selectedServiceID !== '' && selectedServiceID !== 'Add New Service') {
      fetch('http://localhost:5050/services/' + selectedServiceID, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => {
          setServiceName(data.serviceName)
          setServiceCost(data.cost)
          setSelectedTechs(data.technicians)
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (selectedServiceID === 'Add New Service'){
      setServiceName('');
      setServiceCost(0.00);
      setSelectedTechs([]);
    }
  }, [selectedServiceID])

  return (
    <Grid container spacing={3} style={{ width: '50vw', height: '75vh', marginLeft: '25vw', marginTop: '12.5vh' }}>
      <Grid item xs={8}>
        <InputLabel id='serviceSelectBox'>Service Selected</InputLabel>
        <Select
          labelId='serviceSelectBox'
          id='serviceSelect'
          value={selectedServiceID}
          onChange={(event) => {
            setSelectedService(event.target.value);
            console.log(event.target.key);
          }}
          fullWidth
          MenuProps={MenuProps}
        >
          {['', 'Add New Service', ...services].map((service) => (
            <MenuItem key={service['_id'] ? service['_id'] : service} value={service['_id'] ? service['_id'] : service}>
              {service['_id'] ? service['serviceName'] : service}
            </MenuItem>
          ))}
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
          input={<OutlinedInput id='select-multiple-chip' label='chip' />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedTechNames.map((name) => (
                <Chip key={name} label={name} />
              ))}
            </Box>
          )}
        >
          {technicians.map((tech) => (
            <MenuItem key={tech['_id']} value={tech['_id']}>
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
            postService();
          }}
        >
          {selectedServiceID === '' || selectedServiceID === 'Add New Service' ? 'Add Service' : 'Save Changes'}
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
