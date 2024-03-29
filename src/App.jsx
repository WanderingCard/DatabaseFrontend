import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [formData, setFormData] = useState({
        customer_id: '',
        dateTime: '',
        job_id: ''
    });
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5050/jobs', formData);
            console.log(response.data);
            setAlertMessage('Form submitted successfully!');
        } catch (error) {
            console.error(error);
            setAlertMessage('Error submitting form. Please try again.');
        }
    };

    return (
        <div>
            <h1>Functional Integration Test</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="customer_id">Customer ID:</label>
                    <input
                        type="text"
                        id="customer_id"
                        name="customer_id"
                        value={formData.customer_id}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="dateTime">Date Time:</label>
                    <input
                        type="text"
                        id="dateTime"
                        name="dateTime"
                        value={formData.dateTime}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="job_id">Job ID:</label>
                    <input
                        type="text"
                        id="job_id"
                        name="job_id"
                        value={formData.job_id}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {alertMessage && <div className="alert">{alertMessage}</div>}
        </div>
    );
}

export default App;


