/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const catatanGizi = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

catatanGizi.post('/post', async (req, res) => {
  try {
    const {
      tanggal, tinggibadan, beratbadan, statusgizi, id_anak,
    } = req.body;

    const { data, error } = await supabase
      .from('catatan_gizi')
      .insert([{
        tanggal, tinggibadan, beratbadan, statusgizi, id_anak,
      }]);

    if (error) {
      throw error;
    }

    const insertedData = data && data.length > 0 ? data[0] : null;

    res.status(201).json({ success: true, data: insertedData });
  } catch (error) {
    console.error('Error during POST operation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

catatanGizi.get('/get/:id_anak', async (req, res) => {
  try {
    const { id_anak } = req.params;

    // Ambil data catatan gizi dari database berdasarkan id_anak
    const { data, error } = await supabase
      .from('catatan_gizi')
      .select('*')
      .eq('id_anak', id_anak)
      .order('tanggal', { ascending: false });

    if (error) {
      throw error;
    }

    // Kirim data catatan gizi ke frontend
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error during GET operation:', error);
    // Kirim respons jika terjadi kesalahan
    res.status(500).json({ success: false, error: error.message });
  }
});

catatanGizi.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Hapus catatan gizi dari database berdasarkan ID
    const { data, error } = await supabase
      .from('catatan_gizi')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Kirim respons sukses
    res.status(200).json({ success: true, message: 'Catatan gizi berhasil dihapus.' });
  } catch (error) {
    console.error('Error during DELETE operation:', error);
    // Kirim respons jika terjadi kesalahan
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = catatanGizi;
