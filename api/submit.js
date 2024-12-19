const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    const result = await pool.query(query, values);

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
};
