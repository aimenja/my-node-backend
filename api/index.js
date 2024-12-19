const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000; // Use environment PORT or default to 3000

// Middleware to handle CORS and JSON requests
app.use(cors());
app.use(express.json());

// PostgreSQL connection using Supabase's DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase's SSL connection
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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

// Root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Supabase-powered Node.js API!');
});

// Start the server
const serverless = require('serverless-http');
module.exports = serverless(app);
