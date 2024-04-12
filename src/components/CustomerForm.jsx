import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

function CustomerForm() {
  const [customerData, setCustomerData] = useState({
    fname: '',
    lname: '',
    address: '',
    phoneNumber: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [usedPhoneNumbers, setUsedPhoneNumbers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5050/customers')
      .then(response => {
        setCustomers(response.data);
        const phoneNumbers = response.data.map(customer => customer.phoneNumber);
        setUsedPhoneNumbers(phoneNumbers);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }, []);

  const handleChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyFields = Object.keys(customerData).filter(key => customerData[key] === '');
    if (emptyFields.length > 0) {
      setErrorFields(emptyFields);
      setAlertMessage('Please fill in all required fields.');
      return;
    }
    if (usedPhoneNumbers.includes(customerData.phoneNumber)) {
      setErrorFields(['phoneNumber']);
      setAlertMessage('Phone number already exists. Please use a different phone number.');
      return;
    }
    axios.post('http://localhost:5050/customers', customerData)
      .then(response => {
        setAlertMessage('Customer added successfully.');
        setCustomerData({
          fname: '',
          lname: '',
          address: '',
          phoneNumber: '',
        });
        setCustomers([...customers, response.data]); 
        setUsedPhoneNumbers([...usedPhoneNumbers, response.data.phoneNumber]); 
      })
      .catch(error => {
        console.error('Error adding customer:', error);
        setAlertMessage('Error adding customer: ' + error.message);
      });
  };

  const handleDeleteConfirmationOpen = (customer) => {
    setCustomerToDelete(customer);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      axios.delete(`http://localhost:5050/customers/${customerToDelete._id}`)
        .then(() => {
          setAlertMessage('Customer deleted successfully');
          setCustomers(customers.filter(customer => customer._id !== customerToDelete._id));
          setUsedPhoneNumbers(usedPhoneNumbers.filter(phoneNumber => phoneNumber !== customerToDelete.phoneNumber));
          setDeleteConfirmationOpen(false);
        })
        .catch(error => {
          console.error('Error deleting customer:', error);
          setAlertMessage('Error deleting customer: ' + error.message);
          setDeleteConfirmationOpen(false);
        });
    }
  };

  return (
    <Paper style={{ padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        New Customer Form
      </Typography>
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="fname"
              value={customerData.fname}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('fname')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lname"
              value={customerData.lname}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('lname')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              name="address"
              value={customerData.address}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('address')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={customerData.phoneNumber}
              onChange={handleChange}
              fullWidth
              required
              error={errorFields.includes('phoneNumber')}
              helperText={errorFields.includes('phoneNumber') ? 'Phone number already taken' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Customer
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h5" component="h2" gutterBottom style={{ marginTop: '20px' }}>
        Existing Customers
      </Typography>
      <Grid container spacing={2}>
        {customers.map(customer => (
          <Grid item xs={12} sm={6} md={4} key={customer._id}>
            <Paper style={{ padding: '10px', borderRadius: '5px', border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1">Name: {customer.fname} {customer.lname}</Typography>
              <Typography variant="body1">Address: {customer.address}</Typography>
              <Typography variant="body1">Phone Number: {customer.phoneNumber}</Typography>
              <IconButton aria-label="delete" color="error" onClick={() => handleDeleteConfirmationOpen(customer)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this customer?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCustomer} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default CustomerForm;
