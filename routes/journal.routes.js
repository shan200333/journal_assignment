const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const { validate } = require('../utils/validate.utils');
const { upload } = require('../utils/file.utils');
const {
  createJournal,
  updateJournal,
  deleteJournal,
  publishJournal,
  getTeacherFeed,
  getStudentFeed,
} = require('../controllers/journal.controller');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  upload,
  [
    check('description', 'Description is required').notEmpty(),
    check('studentIds', 'Student IDs must be an array of integers').optional().isArray(),
    check('studentIds.*', 'Each student ID must be an integer').optional().isInt(),
    check('published_at', 'Published_at must be a valid date').optional().isISO8601(),
  ],
  validate,
  createJournal
);

router.patch(
  '/:id',
  authMiddleware,
  upload,
  [
    check('description', 'Description is required').optional().notEmpty(),
    check('studentIds', 'Student IDs must be an array of integers').optional().isArray(),
    check('studentIds.*', 'Each student ID must be an integer').optional().isInt(),
    check('published_at', 'Published_at must be a valid date').optional().isISO8601(),
    check('id', 'Journal ID must be an integer').isInt(),
  ],
  validate,
  updateJournal
);

router.delete(
  '/:id',
  authMiddleware,
  [check('id', 'Journal ID must be an integer').isInt()],
  validate,
  deleteJournal
);

router.post(
  '/:id/publish',
  authMiddleware,
  [check('id', 'Journal ID must be an integer').isInt()],
  validate,
  publishJournal
);

router.get('/feed/teacher', authMiddleware, getTeacherFeed);
router.get('/feed/student', authMiddleware, getStudentFeed);

module.exports = router;