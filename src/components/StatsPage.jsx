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
                                value={filterStartTime}
                                onChange={(newValue) => {
                                    console.log(newValue);

                                    setStartTime(newValue)
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