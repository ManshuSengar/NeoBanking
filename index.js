const express = require('express')
const app = express()
const PORT = process.env.PORT || 5010;
const common = require('./routes/common');
const { v4: uuidv4 } = require('uuid');
var bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors())
app.use(express.json())
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/common', common);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send('hello');
})
app.listen(PORT, () => {
    console.log('App running on port', PORT)
})




import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

const MyComponent = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Fetch data from API
    fetch('your-api-endpoint')
      .then(response => response.json())
      .then(data => {
        // Handle successful response
      })
      .catch(error => {
        setAlertMessage(error.message || 'An error occurred');
        setOpenAlert(true); // Or setOpenSnackbar(true);
      });
  }, []);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      {/* Option 1: Using Alert component */}
      <Alert severity="error" open={openAlert} onClose={handleCloseAlert}>
        {alertMessage}
        <Button onClick={handleCloseAlert}>Close</Button>
      </Alert>

      <br />

      {/* Option 2: Using Snackbar component */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {alertMessage}
          <Button onClick={handleCloseSnackbar}>Close</Button>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MyComponent;
    
