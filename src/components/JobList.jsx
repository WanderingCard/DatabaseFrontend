//Changed to be the defacto show all jobs and adjust by date tab
import { Grid, InputLabel, MenuItem, Paper, Select, Table, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


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
    const [visitsLoaded, setLoaded] = useState(false);
    const [technicians, setTechnicians] = useState([]);

    useEffect(() => {
        getAllCustomers();
        getAllCars();
        getAllVisits();
        getAllTechs();
    }, [])

    useEffect(() => {
        filterJobs();
        // setLoaded(true);
    }, [visits, cars, visits])

    useEffect(() => {
        if (filteredVisits.length > 0)
            setLoaded(true);
    }, [filteredVisits])

    async function getAllCustomers() {
        await fetch('http://localhost:5050/customers/', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((json) => {
                setCustomers(json);
                console.log(json);
            })
            .catch((err) => console.error(err))
    }

    async function getAllCars() {
        await fetch('http://localhost:5050/cars/', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((json) => {
                setCars(json);
                console.log(json);
            })
            .catch((err) => console.error(err))
    }

    async function getAllVisits() {
        await fetch('http://localhost:5050/visit/', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((json) => {
                setVisits(json);
                console.log(json);
            })
            .catch((err) => console.error(err))
    }

    async function getAllTechs() {
        await fetch('http://localhost:5050/technicians/', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((json) => setTechnicians(json))
        .catch((err) => console.error(err))
    }

    useEffect(() => {
        console.log(customers)
    }, [customers])

    useEffect(() => {
        if (selectedCustomer !== 'no value') {
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
        console.log(customerCars);
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
                    if (dateInRange(visits[i]['date'], filterStartTime, filterEndTime) === true)
                        filter.push(visits[i]);
                }
            }
        }
        console.log(filter);
        setFilteredVisits(filter);
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

    function getCarData(carId) {
        // console.log(carId);
        for (var i = 0; i < cars.length; i++) {
            // console.log(cars[i]._id)
            if (cars[i]._id === carId)
                return cars[i];
        }
        return null;
    }

    function getCustomerName(custId) {
        for (var i = 0; i < customers.length; i++) {
            if (customers[i]._id === custId)
                return customers[i].fname + ' ' + customers[i].lname;
        }
        return null;
    }

    /**
     * 
     * @param {Array[object]} array - an array of visits, must contain the car attribute
     */
    function groupByCar(array) {
        var carVisits = {};
        for (var i = 0; i < array.length; i++) {
            if(array[i].car in carVisits) {
                // var newArray = carVisits[array[i].car].push(array[i]);
                var newArray = [...carVisits[array[i].car], array[i]];
                carVisits = {...carVisits, [array[i].car]: newArray};
            } else {
                carVisits = {...carVisits, [array[i].car]: [array[i]]};
            }
            console.log(array[i].car, carVisits)
        }

        var sortedArray = [];

        console.log(carVisits)

        for (const car in carVisits) {
            const carSort = carVisits[car].sort((a, b) => a.car.localeCompare(b.car));
            sortedArray = sortedArray.concat(carSort);
        }
        return sortedArray;
    }

    function sortByDate(array) {
        
    }

    function getTechName(techId) {
        for(var i = 0; i < technicians.length; i++) {
            if (technicians[i]._id === techId) {
                return technicians[i].firstname + ' ' + technicians[i].lastname;
            }
        }
        return "N/A";
    }

    return (
        <Grid container spacing={3} marginTop={'5px'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item xs={4}>
                    <InputLabel id='start-date-picker'>Start Date</InputLabel>
                    <DatePicker
                        fullWidth
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
                        fullWidth
                        value={filterEndTime}
                        onChange={(newValue) => {
                            console.log(newValue);
                            setEndTime(newValue)
                        }}
                    />
                </Grid>
            </LocalizationProvider>
            <Grid item xs={12}>
                <Table component={Paper} sx={{ overflowX: 'scroll', overflowY: 'scroll'}} >
                    <TableHead>
                        {selectedCustomer === 'no value' && <TableCell>Customer Name</TableCell>}
                        <TableCell>License Plate</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Date and Time</TableCell>
                        <TableCell>Service Name</TableCell>
                        <TableCell>Service Cost</TableCell>
                        <TableCell>Technician</TableCell>
                        <TableCell>Visit Cost</TableCell>
                    </TableHead>
                    {visitsLoaded === false ?
                        <Typography>Loading Visits</Typography> :
                        groupByCar(filteredVisits).map((job) => {
                            var carData = getCarData(job.car);
                            var totalCost = job.job.reduce((total, service) => total + service.service.cost, 0)
                            console.log(carData);
                            return (
                                <>
                                    <TableRow>
                                        {selectedCustomer === 'no value' && <TableCell rowSpan={job.job.length}>{getCustomerName(job.customer)}</TableCell>}
                                        <TableCell rowSpan={job.job.length}>
                                            {carData.licensePlate}
                                        </TableCell>
                                        <TableCell rowSpan={job.job.length}>
                                            {carData.model}
                                        </TableCell>
                                        <TableCell rowSpan={job.job.length}>
                                            {dayjs.tz(job.date, 'America/New_York').format()}
                                        </TableCell>
                                        <TableCell>
                                            {job.job[0].service.serviceName}
                                        </TableCell>
                                        <TableCell>
                                            {job.job[0].service.cost}
                                        </TableCell>
                                        <TableCell>
                                            {getTechName(job.job[0].technician_id)}
                                        </TableCell>
                                    </TableRow>
                                    {job.job.slice(1).map((service) => (
                                        <TableRow>
                                            <TableCell>
                                                {service.service.serviceName}
                                            </TableCell>
                                            <TableCell>
                                                {service.service.cost}
                                            </TableCell>
                                            <TableCell>
                                                {getTechName(service.technician_id)}
                                            </TableCell>
                                        {job.job.length > 1 ? null : (
                                          <TableCell rowSpan={job.job.length}>
                                              {totalCost}
                                          </TableCell>
                                        )}
                                        </TableRow>
                                    ))}
                                </>
                            )
                        })
                    }
                </Table>
            </Grid>
        </Grid >
    )
}

export default ServiceTable;
