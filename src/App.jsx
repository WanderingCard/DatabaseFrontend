import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import CustomerForm from './components/CustomerForm';
import NewCar from './components/NewCar';
import JobList from './components/JobList';
import TechnicianForm from './components/TechnicianForm';
import ServiceForm from './components/ServiceForm';
import VisitForm from './components/VisitForm';
import NoServiceTechs from './components/componentsPt.2/NoServiceTechs';

function App() {
  const [activeSection, setActiveSection] = useState('customers');

  const renderSection = () => {
    switch (activeSection) {
      case 'customers':
        return (
          <div>
            <h2>Customers</h2>
            <CustomerForm />
          </div>
        );
      case 'cars':
        return (
          <div>
            <h2>Cars</h2>
            <NewCar />
          </div>
        );
      case 'jobs':
        return (
          <div>
            <h2>Jobs</h2>
            <JobList />
          </div>
        );
      case 'service':
        return (
          <div>
            <h2>Service</h2>
            <ServiceForm />
          </div>
        )
      case 'technician':
        return (
          <div>
            <h2>Technician</h2>
            <TechnicianForm />
          </div>
        )
      case 'visit':
        return(
          <div>
            <h2>Visit</h2>
            <VisitForm />
          </div>
        )
        case 'noServiceTechs':
        return(
          <div>
            <h2>noServiceTechs</h2>
            <NoServiceTechs />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Mechanic Shop Management
      </Typography>
      <div>
        <button onClick={() => setActiveSection('customers')}>Customers</button>
        <button onClick={() => setActiveSection('cars')}>Cars</button>
        <button onClick={() => setActiveSection('jobs')}>Jobs</button>
        <button onClick={() => setActiveSection('service')}> Services </button>
        <button onClick={() => setActiveSection('technician')}>Technician</button>
        <button onClick={() => setActiveSection('visit')}>Visit</button>
        <button onClick={() => setActiveSection('noServiceTechs')}>NoServiceTechs</button>
      </div>
      {renderSection()}
    </Container>
  );
}

export default App;