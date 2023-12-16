const express = require('express');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userRouter = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

userRouter.get('/profile', async (req, res) => {
  try {
    const accessToken = req.headers.authorization;

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('fullname, email')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

userRouter.put('/profile', async (req, res) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    try {
      const decodedToken = jwt.verify(accessToken.replace('Bearer ', ''), process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const { fullname, email } = req.body;

      const { data, error } = await supabase
        .from('users')
        .update({ fullname, email })
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      res.status(200).json(data);
    } catch (verifyError) {
      console.error('Error verifying token:', verifyError);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

userRouter.put('/put/password', async (req, res) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    const decodedToken = jwt.verify(accessToken.replace('Bearer ', ''), process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { oldPassword, newPassword } = req.body;

    // Verify the old password
    const { data: userData } = await supabase
      .from('users')
      .select('password')
      .eq('id', userId)
      .single();

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Update the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedNewPassword })
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = userRouter;
