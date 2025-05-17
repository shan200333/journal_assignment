const express = require('express');
const { check } = require('express-validator');
const { validate } = require('../utils/validate.utils');
const { login, register, test } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post(
  '/login',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
  ],
  validate,
  login
);

router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Role must be Teacher or Student').isIn(['Teacher', 'Student']),
  ],
  validate,
  register
);

router.get('/test', authMiddleware, test);

module.exports = router;