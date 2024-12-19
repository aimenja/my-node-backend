const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

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
    // Insert data into the 'submissions' table
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          customer_name: customerName,
          location: location,
          phone_number: phoneNumber,
          system_type: systemType,
          solar_panels: solarPanels,
          panel_type: panelType,
          system_power: systemPower,
          panel_count: panelCount,
          inverter_brand: inverterBrand,
          ac_wiring: acWiring || false,
          dc_wiring: dcWiring || false,
          installation: installation || false,
          transportation: transportation,
          net_metering: netMetering || false,
          custom_preferences: customPreferences,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: 'Form data saved successfully!',
      data: data[0],
    });
  } catch (err) {
    console.error('Error saving form data:', err.message);
    res.status(500).json({
      error: 'Failed to save form data',
      details: err.message,
    });
  }
};
