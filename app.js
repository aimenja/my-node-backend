//const express = require('express');
//const app = express();

// Middleware
//app.use(express.json());

// Route
//app.get('/', (req, res) => {
//    res.send('Hello, World!');
//});

// Start server
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
 //   console.log(`Server running on port ${PORT}`);
//});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(bodyParser.json()); // Parse JSON data from requests

// API Endpoints
app.post('/submit-form', (req, res) => {
    const formData = req.body;

    // Log the received data for debugging
    console.log('Received form data:', formData);

    // You can add your logic here (e.g., save to database)
    // For now, we'll simulate success/failure
    const success = Math.random() > 0.2; // Simulate an 80% success rate

    if (success) {
        res.status(200).json({ message: 'Form successfully submitted!' });
    } else {
        res.status(500).json({ message: 'Failed to submit the form. Please try again.' });
    }
});

// Default Route
app.get('/', (req, res) => {
    res.send('Backend for Solar Calculator');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
