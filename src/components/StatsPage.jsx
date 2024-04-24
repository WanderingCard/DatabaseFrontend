import React, { useEffect, useState } from 'react';
import { Grid, InputLabel, MenuItem, Select, Snackbar, Alert, Button, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function StatsPage(){
    const [filterStartTime, setStartTime] = useState(null);
    const [filterEndTime, setEndTime] = useState(null)
    const [visits, setVisits] = useState([]);
    const [filteredVisits, setFilteredVisits] = useState([]);

    useEffect(() => {
        getAllVisits();
    }, [])

    useEffect(() => {
        filterJobs();
    }, [filteredVisits])


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

    function filterJobs() {
        var filter = [];
        if (filterStartTime === null && filterEndTime === null) {
            // setFilteredVisits(visits);
            filter = visits;
        } else {
            for (var i = 0; i < visits.length; i++) {
                    if (dateInRange(visits[i]['date'], filterStartTime, filterEndTime) === true)
                        filter.push(visits[i]);
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

    return(
        <div>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h4" style={{ marginBottom: '20px', color: '#1976d2' }}>
                Set Time Frame
                </Typography>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid item xs={4}>
                            <InputLabel id= 'start-date-picker'>Start Date</InputLabel>
                            <DatePicker>
                                fullWidth
                                value={filterStartTime}
                                onChange={(newValue) => {
                                    console.log(newValue);

                                    setStartTime(newValue)
                                }}
                            </DatePicker>
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel id= 'end-date-picker'>End Date</InputLabel>
                            <DatePicker>
                                fullWidth
                                value={filterEndTime}
                                onChange={(newValue) => {
                                    console.log(newValue);

                                    setEndTime(newValue)
                                }}
                            </DatePicker>
                        </Grid>
                    </LocalizationProvider>
                </Grid>
            </Paper>
        </div>
    );
}

export default StatsPage;