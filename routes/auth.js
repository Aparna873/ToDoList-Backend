const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    console.log("Saving user:", newUser);
    const token = jwt.sign({
       id: newUser._id, 
       username: newUser.username,
       email: newUser.email
      }, process.env.JWT_SECRET, {
      expiresIn: '2 min',
    });
    res.status(201).json({ token});
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email ,joinDate:user.joinDate},
      process.env.JWT_SECRET,
      { expiresIn: '2 min' }
    );

    // Send token + user data together
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        joinDate: user.joinDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

module.exports = router;