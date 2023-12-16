const express = require('express');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const dashboard = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

dashboard.get('/get/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'ID Pengguna diperlukan' });
    }

    const { data, error } = await supabase
      .from('anak')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error saat mengambil data anak:', error);
      return res.status(500).json({ error: 'Kesalahan Server Internal' });
    }

    res.status(200).json({ anak: data });
  } catch (error) {
    console.error('Error saat mengambil data anak:', error);
    res.status(500).json({ error: 'Kesalahan Server Internal' });
  }
});

dashboard.put('/put/:idAnak', async (req, res) => {
  try {
    const { idAnak } = req.params;
    const { namaAnak, usia, jenisKelamin } = req.body;

    const { data, error } = await supabase
      .from('anak')
      .update({ nama: namaAnak, usia, kelamin: jenisKelamin })
      .eq('id', idAnak);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error during PUT operation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

dashboard.delete('/delete/:idAnak', async (req, res) => {
  try {
    const { idAnak } = req.params;

    const { data, error } = await supabase
      .from('anak')
      .delete()
      .eq('id', idAnak);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error during DELETE operation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = dashboard;
