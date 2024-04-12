import React, { useEffect, useState } from 'react';
import { Paper, Box, Button, Chip, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField, Snackbar, Alert, TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';

function VisitForm() {
  // const [integrationData, setIntData] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [selectedTechnicians, setSelectedTechs] = useState([]);
  const [technicians, setTechs] = useState([]);
  const [selectedServiceID, setSelectedService] = useState("");
  const [selectedTechNames, setSelectedTechNames] = useState([]);
  const [cars, setCars] = useState([]);

  const [customerCar, setCustomerCar] = useState([]);
  const [visits, setVisits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobSlots, setJobSlots] = useState(0);
  
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [visitDate, setDate] = useState();

  // Alert State Variables
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertError, setAlertError] = useState(false);

  async function postService() {
    var url = 'http://localhost:5050/visits/'
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
      .then((json) => {
        console.log(json)
        setAlertError(false);
        setAlertMessage(selectedServiceID === 'Add New Service' ? 'Successfully Added New Service' : 'Changes Saved');
        setShowAlert(true);
        fetchAllData();
        if(selectedServiceID === 'Add New Service') {
          setServiceName('');
          setServiceCost(0);
          setSelectedTechs([]);
          setSelectedTechNames([]);
        }
      })
      .catch((err) => {
        console.log(err.message)
        setShowAlert(true);
        setAlertError(true);
        setAlertMessage(selectedServiceID === 'Add New Service' ? 'Error Adding New Service' : 'Error Editing Service ' + serviceName);
      })
  }

  useEffect(() => {
    fetch('http://localhost:5050/customers/', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch((err) => {
        console.log(err);
      })
  })

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
    fetchAllData();
  }, [])

  useEffect(() => {
    console.log(technicians)
  }, [technicians])

  const fetchAllData = async () => {
    await fetch('http://localhost:5050/services/', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function deleteService() {
    if (selectedServiceID !== 'Add New Service') {
      await fetch('http://localhost:5050/services/' + selectedServiceID, {
        method: 'DELETE'
      })
        .then((response) => {
          if (response.status === 200) {
            setAlertMessage('Successfully Deleted Service');
            setAlertError(false);
            setShowAlert(true);
            setSelectedService('');
            setServiceName('');
            setServiceCost(0);
            setSelectedTechs([]);
            fetchAllData();
          }
        })
        .catch((err) => {
          console.log(err);
          setAlertError('Error Deleting Service');
          setAlertError(true);
          setShowAlert(true);
        })
    }
  }

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      }
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  }

  function getTechName(techID) {
    console.log(technicians[0])
    for(var i = 0; i < technicians.length; i++) {
      if (technicians[i]['_id'] === techID)
        return technicians[i]['firstname'] + ' ' + technicians[i]['lastname'];
    }
    console.log('Error finding tech name');
    return 'Error';
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
    } else if (selectedServiceID === 'Add New Service') {
      setServiceName('');
      setServiceCost(0.00);
      setSelectedTechs([]);
    }
  }, [selectedServiceID])

  function getTechNames(techIds) {
    if (techIds.length === 0)
      return 'None';
    var technicianNames = '';
    techIds.map((techId) => {
      technicianNames += getTechName(techId) + ", ";
    })
    return technicianNames.substring(0,technicianNames.length-2);
  }

  useEffect(() => {
    fetch('http://localhost:5050/cars/', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((data) => {
      setCars(data);
    })
  })

  useEffect(() => {
    if(selectedCustomer !== '') {
      fetch('http://localhost:5050/customers/' + selectedCustomer, {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((data) => {
        var customerCarIds = data.cars;
        var customerCards = [];
        for (var i = 0; i < customerCarIds.length; i++) {
          var found = false;
          for (var a = 0; a < cars.length && !found; a++) {
            if(cars[a]['_id'] === customerCarIds[i]) {
              customerCards.push(cars[a]);
              found = true;
            }
          }
        }
        setCustomerCar(customerCards);
        console.log(data.cars);
      })
      .catch((err) => {
        console.log(err.message);
      })
    }
  }, [selectedCustomer])

  return (
    <div>
      <Grid container spacing={3} style={{ width: '50vw', height: '75vh', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', marginTop: '20px'}}>
        {/* Customer */}
        <Grid item xs={6}>
          <InputLabel id='customerLabel'>Customer</InputLabel>
          <Select
            fullWidth
            labelId='customerLabel'
            value={selectedCustomer}
            onChange={(event) => {
              setSelectedCustomer(event.target.value);
            }}
          >
            {customers.map((customer) => (
              <MenuItem key={customer['_id']} value={customer['_id']}>
                {customer['fname'] + ' ' + customer['lname']}
              </MenuItem>
              ))}
          </Select>
        </Grid>
        {/* Car */}
        <Grid item xs={6}>
          <InputLabel id='carLabel'>Car</InputLabel>
          <Select
            fullWidth
            labelId='carLabel'
            value={selectedCar}
            onChange={(event) => {
              setSelectedCar(event.target.value);
            }}
          >
            {customerCar.map((car) => (
              <MenuItem key={car['_id']} value={car['_id']}>
                {car['model'] + ' - ' + car['licensePlate']}
              </MenuItem>
              ))}
          </Select>
        </Grid>

        {/* Date */}

        <Grid item xs={6}>
          <InputLabel id='dateLabel'>Date of Service</InputLabel>

        </Grid>

        {/* Rows for Jobs */}

        {/* Service Select */}
        <Grid item xs={4}>
          <InputLabel id='serviceLabel'>Service</InputLabel>

        </Grid>

        {/* Tech Select */}
        <Grid item xs={4}>
          <InputLabel id='techLabel'>Technician</InputLabel>

        </Grid>

        {/* Delete Button */}
        <Grid item xs={4}>
          <Button>
            Delete Service
          </Button>
        </Grid>

        {/** Add Additional Service Button */}
        <Grid item xs={4}>
          <Button>
            Add Service
          </Button>
        </Grid>

        {/* <Grid item xs={12}>
          <TableContainer component={Paper} style={{maxHeight: '250px'}} sx={{overflowX: 'hidden', overflowY:'scroll'}} fullWidth>
            <Table fullWidth stickyHeader>
              <TableHead>
                <TableRow style={{backgroundColor: '#'}}>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Service Cost</TableCell>
                  <TableCell>Qualified Technicians</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow>
                    <TableCell>
                     { service.serviceName}
                    </TableCell>
                    <TableCell>{service.cost}</TableCell>
                    <TableCell>{getTechNames(service.technicians)}</TableCell>
                  </TableRow>
                )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid> */}
      </Grid>
      <Snackbar
        open={showAlert}
        onClose={handleClose}
        autoHideDuration={6000}
      >
        <Alert
          onClose={handleClose}
          severity={alertError === true ? 'error' : 'success'}
          variant='filled'
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default VisitForm;
