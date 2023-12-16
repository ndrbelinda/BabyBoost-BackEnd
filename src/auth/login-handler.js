const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const loginRouter = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;

const supabase = createClient(supabaseUrl, supabaseKey);

loginRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const { data: user } = await supabase
      .from('users')
      .select('id, password, fullname')
      .eq('username', username)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'Username atau kata sandi salah' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Username atau kata sandi salah' });
    }

    // Pass user information as the payload
    const accessToken = jwt.sign({ userId: user.id, fullname: user.fullname }, jwtSecret, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login berhasil',
      user: { id: user.id, fullname: user.fullname },
      accessToken,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = loginRouter;
