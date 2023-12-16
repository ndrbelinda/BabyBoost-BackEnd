const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const registerRouter = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

registerRouter.post('/register', async (req, res) => {
  try {
    const {
      username, email, password, fullname,
    } = req.body;

    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: newUserError } = await supabase
      .from('users')
      .upsert([
        {
          username,
          email,
          password: hashedPassword,
          fullname,
        },
      ]);

    if (newUserError) {
      throw newUserError;
    }

    res.status(201).json({ message: 'Registrasi berhasil', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = registerRouter;
