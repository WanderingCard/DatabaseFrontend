import { Grid, InputLabel, MenuItem, Paper, Select, Table, TableCell, TableHead, TableRow } from "@mui/material";
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function ServiceTable() {
    const [customerCars, setCustomerCars] = useState([]);
    const [customerServices, setServices] = useState([]);
    const [visits, setVisits] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('no value');
    const [filterStartTime, setStartTime] = useState(null);
    const [filterEndTime, setEndTime] = useState(null);
    const [cars, setCars] = useState([]);
    const [filteredVisits, setFilteredVisits] = useState([]);

    useEffect(() => {
        getAllCustomers();
        getAllCars();
        getAllVisits();
    }, [])

    function getAllCustomers() {
        fetch('http://localhost:5050/customers/', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((json) => {
                setCustomers(json);
                console.log(json);
            })
            .catch((err) => console.error(err))
    }

    function getAllCars() {
        fetch('http://localhost:5050/cars/', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((json) => {
                setCars(json);
                console.log(json);
            })
            .catch((err) => console.error(err))
    }

    function getAllVisits() {
        fetch('http://localhost:5050/visit/', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((json) => {
                setVisits(json);
                console.log(json);
            })
            .catch((err) => console.error(err))
    }

    useEffect(() => {
        console.log(customers)
    }, [customers])

    useEffect(() => {
        if(selectedCustomer !== 'no value') {
            fetch('http://localhost:5050/customers/' + selectedCustomer, {
                method: 'GET'
            })
                .then((response) => response.json())
                .then((json) => {
                    setCustomerCars(json.cars)
                    // console.log(json.cars);
                })
        } else {
            setCustomerCars([]);
        }
    }, [selectedCustomer])

    useEffect(() => {
        filterJobs();
    }, [customerCars, filterStartTime, filterEndTime])

    function filterJobs() {
        var filter = [];
        if (customerCars.length === 0 && filterStartTime === null && filterEndTime === null) {
            // setFilteredVisits(visits);
            filter = visits;
        } else {
            for (var i = 0; i < visits.length; i++) {
                if (customerCars.length === 0 || customerCars.includes(visits[i]['car'])) {
                    if(dateInRange(visits[i]['date'], filterStartTime, filterEndTime) === true)
                        filter.push(visits[i]);
                }
            }
        }
        console.log(filter);
        setFilteredVisits(visits);
    }

    /**
     * 
     * @param {string} testDate 
     * @param {dayjs} startDate 
     * @param {dayjs} endDate 
     * @returns 
     */
    function dateInRange(testDate, startDate, endDate) {
        if (startDate === null && endDate === null) 
            return true;
        if (startDate !== null && dayjs(testDate).isBefore(startDate))
            return false;
        if (endDate !== null && dayjs(testDate).isAfter(endDate))
            return false;
        return true;
    }

    return (
        <Grid container spacing={3} marginTop={'5px'}>
            <Grid item xs={4}>
                <InputLabel id='CustomerSelectBox'>Customer</InputLabel>
                <Select
                    fullWidth
                    labelId='CustomerSelectBox'
                    id='ServiceSelect'
                    value={selectedCustomer}
                    onChange={(event) => {
                        setSelectedCustomer(event.target.value);
                        console.log(event.target.value);
                    }}
                >
                    {["", ...customers].map((customer) => (
                        <MenuItem key={customer._id ? customer._id : 'no_value'} value={customer._id ? customer._id : 'no value'}>
                            {customer._id ? customer.fname + " " + customer.lname : '-- Select Customer --'}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item xs={4}>
                    <InputLabel id='start-date-picker'>Start Date</InputLabel>
                    <DatePicker
                        value={filterStartTime}
                        onChange={(newValue) => {
                            console.log(newValue);
                            
                            setStartTime(newValue)
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InputLabel id='end-date-picker'>End Date</InputLabel>
                    <DatePicker
                        value={filterEndTime}
                        onChange={(newValue) => {
                            console.log(newValue);
                            setEndTime(newValue)
                        }}
                    />
                </Grid>
            </LocalizationProvider>
            <Grid item xs={12}>
                <Table component={Paper} sx={{ marginTop: '5px' }}>
                    <TableHead>
                        <TableCell>Car</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Technician</TableCell>
                    </TableHead>
                    <TableRow>
                        <TableCell rowSpan={2}>Testing</TableCell>
                        <TableCell>Testing Two</TableCell>
                        <TableCell>Testing Three</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Testing Two</TableCell>
                        <TableCell>Testing Three</TableCell>
                    </TableRow>
                </Table>
            </Grid>
        </Grid >
    )
}

export default ServiceTable;
