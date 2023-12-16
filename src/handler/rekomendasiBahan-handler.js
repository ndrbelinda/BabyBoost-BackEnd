const express = require('express');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const rekomendasiBahan = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

rekomendasiBahan.get('/get/karbohidrat', async (req, res) => {
  try {
    const { data, error } = await supabase.from('karbohidrat').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching karbohidrat data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

rekomendasiBahan.get('/get/lemak', async (req, res) => {
  try {
    const { data, error } = await supabase.from('lemak').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching lemak data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

rekomendasiBahan.get('/get/protein', async (req, res) => {
  try {
    const { data, error } = await supabase.from('protein').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching protein data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = rekomendasiBahan;
