const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's port or default to 3000
app.use(cors());

// Middleware to parse incoming JSON data
app.use(express.json());

// PostgreSQL connection using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL for Render
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // SSL for Render PostgreSQL
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to the database:', err.stack);
  }
  console.log('Connected to the database successfully!');
  release();
});

// Route to handle form submissions
app.post('/submit', async (req, res) => {
  const {
    customerName,
    location,
    phoneNumber,
    systemType,
    solarPanels,
    panelType,
    systemPower,
    panelCount,
    inverterBrand,
    acWiring,
    dcWiring,
    installation,
    transportation,
    netMetering,
    customPreferences,
  } = req.body;

  try {
    // SQL query to insert data into "submissions" table
    const query = `
      INSERT INTO submissions (
        customer_name, 
        location, 
        phone_number, 
        system_type, 
        solar_panels, 
        panel_type, 
        system_power, 
        panel_count, 
        inverter_brand, 
        ac_wiring, 
        dc_wiring, 
        installation, 
        transportation, 
        net_metering, 
        custom_preferences
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )
      RETURNING *;
    `;

    // Values from the form
    const values = [
      customerName,
      location,
      phoneNumber,
      systemType,
      solarPanels,
      panelType,
      systemPower,
      panelCount,
      inverterBrand,
      acWiring || false,
      dcWiring || false,
      installation || false,
      transportation,
      netMetering || false,
      customPreferences,
    ];

    // Execute the query
    const result = await pool.query(query, values);

    // Return success response
    res.status(200).json({
      message: 'Form data saved successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error saving form data:', err);
    res.status(500).json({
      error: 'Failed to save form data',
      details: err.message,
    });
  }
});

// Root route for basic API testing
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js API!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Access the app here: ', process.env.NODE_ENV === 'production'
    ? 'Your deployed Render URL'
    : `http://localhost:${PORT}`);
});
