import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, InputLabel, MenuItem, Paper, Select, Table, TableCell, TableHead, TableRow, Typography } from "@mui/material";
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
    const [selectedTechnician, setSelectedTechnician] = useState('');

    useEffect(() => {
        getAllCustomers();
        getAllCars();
        getAllVisits();
        getAllTechs();
    }, [])

    useEffect(() => {
        filterJobs();
    }, [visits, cars, selectedTechnician, filterStartTime, filterEndTime])

    useEffect(() => {
        if (filteredVisits.length > 0)
            setLoaded(true);
    }, [filteredVisits])

    async function getAllCustomers() {
        try {
            const response = await axios.get('http://localhost:5050/customers/');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    }

    async function getAllCars() {
        try {
            const response = await axios.get('http://localhost:5050/cars/');
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    }

    async function getAllVisits() {
        try {
            const response = await axios.get('http://localhost:5050/visit/');
            setVisits(response.data);
        } catch (error) {
            console.error('Error fetching visits:', error);
        }
    }

    async function getAllTechs() {
        try {
            const response = await axios.get('http://localhost:5050/technicians/');
            setTechnicians(response.data);
        } catch (error) {
            console.error('Error fetching technicians:', error);
        }
    }

    function filterJobs() {
        let filter = [];
        if (selectedTechnician === '' && filterStartTime === null && filterEndTime === null) {
            filter = visits;
        } else {
            filter = visits.filter(visit =>
                (selectedTechnician === '' || visit.job.some(job => job.technician_id === selectedTechnician)) &&
                dateInRange(visit.date, filterStartTime, filterEndTime)
            );
    
            if (selectedTechnician !== '') {
                filter = filter.map(visit => ({
                    ...visit,
                    job: visit.job.filter(job => job.technician_id === selectedTechnician)
                })).filter(visit => visit.job.length > 0);
            }
        }
        setFilteredVisits(filter);
    }

    function getCarData(carId) {
        return cars.find(car => car._id === carId) || {};
    }

    function getCustomerName(custId) {
        const customer = customers.find(customer => customer._id === custId);
        return customer ? `${customer.fname} ${customer.lname}` : '';
    }

    function getTechName(techId) {
        const technician = technicians.find(tech => tech._id === techId);
        return technician ? `${technician.firstname} ${technician.lastname}` : '';
    }

    function getTechSales() {
        let salesTotal = 0;
        filteredVisits.forEach(visit => {
            visit.job.forEach(job => {
                if (job.technician_id === selectedTechnician) {
                    const serviceCost = parseFloat(job.service.cost);
                    if (!isNaN(serviceCost)) {
                        salesTotal += serviceCost;
                    }
                }
            });
        });
        return salesTotal;
    }
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
                <InputLabel id='TechnicianSelectBox'>Technician</InputLabel>
                <Select
                    fullWidth
                    labelId='TechnicianSelectBox'
                    id='ServiceSelect'
                    value={selectedTechnician}
                    onChange={(event) => setSelectedTechnician(event.target.value)}
                >
                    <MenuItem value="">-- Select Technician --</MenuItem>
                    {technicians.map(technician => (
                        <MenuItem key={technician._id} value={technician._id}>
                            {technician.firstname} {technician.lastname}
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
                        onChange={(newValue) => setStartTime(newValue)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InputLabel id='end-date-picker'>End Date</InputLabel>
                    <DatePicker
                        fullWidth
                        value={filterEndTime}
                        onChange={(newValue) => setEndTime(newValue)}
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
                        {selectedTechnician === '' && <TableCell>Technician</TableCell>}
                    </TableHead>
                    {visitsLoaded === false ?
                        <Typography>Loading Visits</Typography> :
                        filteredVisits.map((visit, index) => (
                            <React.Fragment key={index}>
                                {visit.job.map((job, i) => (
                                    <TableRow key={`${index}-${i}`}>
                                        {i === 0 && (
                                            <>
                                                <TableCell rowSpan={visit.job.length}>
                                                    {getCustomerName(visit.customer)}
                                                </TableCell>
                                                <TableCell rowSpan={visit.job.length}>
                                                    {getCarData(visit.car).licensePlate}
                                                </TableCell>
                                                <TableCell rowSpan={visit.job.length}>
                                                    {getCarData(visit.car).model}
                                                </TableCell>
                                                <TableCell rowSpan={visit.job.length}>
                                                    {dayjs.tz(visit.date, 'America/New_York').format()}
                                                </TableCell>
                                            </>
                                        )}
                                        <TableCell>
                                            {job.service.serviceName}
                                        </TableCell>
                                        <TableCell>
                                            {job.service.cost}
                                        </TableCell>
                                        {selectedTechnician === '' && (
                                            <TableCell>
                                                {getTechName(job.technician_id)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))
                    }
                </Table>
            </Grid>
            {selectedTechnician !== '' && (
                <Grid item xs={4}>
                    <Typography>Total Sales: {getTechSales()}</Typography>
                </Grid>
            )}
        </Grid >
    )
}
export default TechTable;
