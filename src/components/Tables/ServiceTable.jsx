import { useEffect, useState } from "react";
import SummaryTable from "./ServiceSubTables/SummaryTable";
import ServicesScheduledTable from "./ServiceSubTables/ServicesScheduledTable";
import { Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function ServiceTable() {
    const [services, setServices] = useState([]);
    const [visits, setVisits] = useState([]);
    const [cars, setCars] = useState([]);
    const [techs, setTechs] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [filteredJobs, setFilteredJobs] = useState([]);

    const [filterService, setFilterService] = useState('summary');
    const [filterStartDate, setStartDate] = useState(null);
    const [filterEndDate, setEndDate] = useState(null);

    useEffect(() => {
        fetchServices();
        fetchVisits();
        fetchCars();
        fetchTechs();
        fetchCustomers();
    }, [])

    useEffect(() => {
        filterJobs(filterService, filterStartDate, filterEndDate);
    }, [filterService, visits, filterStartDate, filterEndDate])

    useEffect(() => {
        console.log(filteredJobs);
    }, [filteredJobs])

    async function fetchServices() {
        await fetch('http://localhost:5050/services', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((json) => {
            setServices(json);
        })
    }

    async function fetchCustomers() {
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

    async function fetchCars() {
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

    async function fetchVisits() {
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

    async function fetchTechs() {
        await fetch('http://localhost:5050/technicians/', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((json) => setTechs(json))
        .catch((err) => console.error(err))
    }

    function filterJobs(serviceId, startDate, endDate) {
        if(serviceId === 'summary') {
            var filtered = generateUsableJobs().filter(job => inRange(job.date, startDate, endDate))
            setFilteredJobs(filtered);            
        } else {
            var filtered = generateUsableJobs().filter(job => job.serviceId === serviceId && inRange(job.date, startDate, endDate));
            setFilteredJobs(filtered);
        }
    }

    function inRange(test, start, end) {
        if(start === null) {
            if(end === null)
                return true;
            return dayjs(test).isBefore(end);
        } else if (end === null) {
            // Start is not null, end is null
            return dayjs(test).isAfter(start);
        } else {
            // Nothing is null
            return dayjs(test).isAfter(start) && dayjs(test).isBefore(end);
        }
    }

    /**
     * 
     * @returns an array of services objects (custom made for this table) [date, customerName, carInfo, serviceName, techName]
     */
    function generateUsableJobs() {
        var output = [];
        for (var i = 0; i < visits.length; i++) {
            var visitObject = visits[i];
            console.log(visitObject);
            var customerName = getCustomerName(visitObject.customer);
            var carLabel = getCarLabel(visitObject.car);
            var date = visitObject.date;
            var serviceList = visitObject.job;
            console.log(serviceList);
            for (var a=0; a < serviceList.length; a++) {
                console.log(serviceList[a]);
                output.push({
                    'date': date,
                    'customerName': customerName,
                    'carInfo': carLabel,
                    'serviceId': serviceList[a].service._id,
                    'techName': getTechnName(serviceList[a].technician_id)
                });
                console.log(output);
            }
        }
        return output;
    }

    function getCustomerName(custId) {
        for (var i = 0; i < customers.length; i++) {
            var customer = customers[i];
            // console.log(customer);
            if (custId === customer._id)
                return customer.fname + ' ' + customer.lname;
        }
        return 'N/A';
    }

    function getTechnName(techId) {
        for (var i = 0; i < techs.length; i++) {
            var tech = techs[i];
            if(tech._id === techId) {
                return tech.firstname + ' ' + tech.lastname;
            }
        }
        return 'N/A';
    }

    function getCarLabel(carId) {
        for (var i = 0; i < cars.length; i++) {
            var car = cars[i];   
            if(car._id === carId) {
                return car.model + ' - ' + car.licensePlate;
            }
        }
        return 'N/A'
    }

    return (
        <>
            <Grid container spacing={3} marginTop={'5px'}>
                <Grid item xs={4}>
                    <InputLabel id='ServiceSelectLabel'>Service</InputLabel>
                    <Select
                        fullWidth
                        labelId='ServiceSelectLabel'
                        value={filterService}
                        onChange={(event) => {
                            setFilterService(event.target.value);
                        }}
                    >
                        {["summary", ...services].map((service) => (
                            <MenuItem key={service._id ? service._id : service} value ={service._id ? service._id : service}>
                                {service.serviceName ? service.serviceName : "Summary"}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item xs={4}>
                    <InputLabel id='start-date-picker'>Start Date</InputLabel>
                    <DatePicker
                        fullWidth
                        value={filterStartDate}
                        onChange={(newValue) => {
                            console.log(newValue);
                            setStartDate(newValue)
                            if(newValue !== null && filterEndDate !== null && newValue.isAfter(filterEndDate)) {
                                setEndDate(newValue);
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InputLabel id='end-date-picker'>End Date</InputLabel>
                    <DatePicker
                        fullWidth
                        value={filterEndDate}
                        onChange={(newValue) => {
                            console.log(newValue);
                            if(newValue !== null && filterStartDate !== null && newValue.isBefore(filterStartDate)) {
                                setStartDate(newValue);
                            }
                            setEndDate(newValue)
                        }}
                    />
                </Grid>
            </LocalizationProvider>
                <Grid item xs={12}>
                    {filterService === 'summary' ? 
                        <SummaryTable 
                            services={services} 
                            startDate = {filterStartDate}
                            endDate = {filterEndDate} 
                            /> : 
                        <ServicesScheduledTable 
                            services = {services}
                            selectedService = {filterService}
                            startDate = {filterStartDate}
                            endDate = {filterEndDate}
                        />} 
                </Grid>
            </Grid>
        </>
    );
}

export default ServiceTable;