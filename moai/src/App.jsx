import './App.css'
import React, { useEffect, useState } from 'react';
import api from './../api.js';

function App() {
  const [dbStatus, setDbStatus] = useState('Checking database connection...');

  useEffect(() => {
    // Use the Axios instance to make a request to the backend
    api.get('/test-db')
      .then((response) => {
        setDbStatus(response.data); // Update the state with the response
      })
      .catch((error) => {
        console.error('Error connecting to backend:', error);
        setDbStatus('Failed to connect to the database.');
      });
  }, []);

  return (
    <div>
      <h1>Welcome to Moai</h1>
      <p>Database Status: {dbStatus}</p>
    </div>
  );
}

export default App;
