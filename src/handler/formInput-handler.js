const express = require('express');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const formInputHandlerRouter = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

formInputHandlerRouter.post('/post/inputData', async (req, res) => {
  try {
    const {
      namaAnak, usiaAnak, jenisKelamin, userId,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { data, error } = await supabase.from('anak').upsert([
      {
        nama: namaAnak,
        usia: usiaAnak,
        kelamin: jenisKelamin,
        user_id: userId,
      },
    ]);

    if (error) {
      console.error('Error during upsert:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(201).json({ message: 'Data anak berhasil disimpan', anak: data });
  } catch (error) {
    console.error('Error during anak input:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = formInputHandlerRouter;
