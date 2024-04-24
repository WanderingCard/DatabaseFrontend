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


function TechTable() {
    const [customers, setCustomers] = useState([]);
    const [cars, setCars] = useState([]);
    const [visits, setVisits] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [filterStartTime, setStartTime] = useState(null);
    const [filterEndTime, setEndTime] = useState(null);
    const [filteredVisits, setFilteredVisits] = useState([]);
    const [visitsLoaded, setLoaded] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState('no value');

    useEffect(() => {
        getAllCustomers();
        getAllCars();
        getAllVisits();
        getAllTechs();
    }, [])

    useEffect(() => {
        filterJobs();
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
        setSelectedTechnician('no value');
        console.log(technicians)
    }, [technicians])

    useEffect(() => {
        console.log(selectedTechnician);
        filterJobs();
    }, [selectedTechnician, filterStartTime, filterEndTime])

    function filterJobs() {
        var filter = [];
        if (selectedTechnician === 'no value' && filterStartTime === null && filterEndTime === null) {
            // setFilteredVisits(visits);
            filter = visits;
        } else {
            for (var i = 0; i < visits.length; i++) {
                if(selectedTechnician === 'no value' || visits[i]['job'].some(job => job.technician_id === selectedTechnician)){
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

    function getTechName(techId) {
        for(var i = 0; i < technicians.length; i++) {
            if (technicians[i]._id === techId) {
                return technicians[i].firstname + ' ' + technicians[i].lastname;
            }
        }
        return "N/A";
    }

    function getTechSales() {
        var salesTotal = 0;
        for(var i = 0; i < filteredVisits.length; i++) {
            if(filteredVisits[i].job.some(job => job.technician_id === selectedTechnician)) {
                for (var j = 0; j < filteredVisits[i].job.length; j++) {
                    if (filteredVisits[i].job[j].technician_id === selectedTechnician) {
                        var serviceCost = parseFloat(filteredVisits[i].job[j].service.cost);
                        if(!isNaN(serviceCost)){
                            salesTotal += filteredVisits[i].job[j].service.cost;
                        }
                    }
                }
            }
        }
        return salesTotal;
    }

    return (
        <Grid container spacing={3} marginTop={'5px'}>
            <Grid item xs={4}>
                <InputLabel id='TechnicianSelectBox'>Technician</InputLabel>
                <Select
                    fullWidth
                    labelId='TechnicianSelectBox'
                    id='ServiceSelect'
                    value={selectedTechnician}
                    onChange={(event) => {
                        setSelectedTechnician(event.target.value);
                        console.log(event.target.value);
                    }}
                >
                    {["", ...technicians].map((technicians) => (
                        <MenuItem key={technicians._id ? technicians._id : 'no_value'} value={technicians._id ? technicians._id : 'no value'}>
                            {technicians._id ? technicians.firstname + " " + technicians.lastname : '-- Select Technician --'}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
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
                        <TableCell>Customer Name</TableCell>
                        <TableCell>License Plate</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Date and Time</TableCell>
                        <TableCell>Service Name</TableCell>
                        <TableCell>Service Cost</TableCell>
                        {selectedTechnician === 'no value' && <TableCell>Technician</TableCell>}
                    </TableHead>
                    {visitsLoaded === false ?
                        <Typography>Loading Visits</Typography> :
                        groupByCar(filteredVisits).map((job) => {
                            var carData = getCarData(job.car);
                            console.log(carData);
                            return (
                                <>
                                    <TableRow>
                                       <TableCell rowSpan={job.job.length}>{getCustomerName(job.customer)}</TableCell>
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
                                        {selectedTechnician === 'no value' &&  <TableCell>
                                            {getTechName(job.job[0].technician_id)}
                                        </TableCell>}
                                    </TableRow>
                                    {job.job.slice(1).map((service) => (
                                        <TableRow>
                                            <TableCell>
                                                {service.service.serviceName}
                                            </TableCell>
                                            <TableCell>
                                                {service.service.cost}
                                            </TableCell>
                                            {selectedTechnician === 'no value' && <TableCell>
                                                {getTechName(service.technician_id)}
                                            </TableCell>}
                                        </TableRow>
                                    ))}
                                </>
                            )
                        })
                    }
                </Table>
            </Grid>
            {selectedTechnician !== 'no value' && (
                <Grid item xs={4}>
                    <Typography>Total Sales: {getTechSales()}</Typography>
                </Grid>
            )}
        </Grid >
    )
}

export default TechTable;