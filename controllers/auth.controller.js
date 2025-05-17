const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.utils');
const { User } = require('../models/index');

const login = async (req, res, next) => {
  try {
    if (!User) {
      throw new Error('User model is undefined');
    }

    const { username, password } = req.body;
    if (!username || !password) {
      const error = new Error('Username and password are required');
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      const error = new Error('Username already exists');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'User created', user_id: user.id });
  } catch (err) {
    console.error('Register error:', err.message);
    next(err);
  }
};

const test = (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    },
  });
};

module.exports = { login, register, test };
