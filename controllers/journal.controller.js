const { Journal, JournalStudent, Attachment, User } = require('../models/index');
const { sendNotification } = require('../utils/notification.utils');

const createJournal = async (req, res, next) => {
  try {
    const { description, studentIds, published_at } = req.body;
    if (req.user.role !== 'Teacher') {
      const error = new Error('Only teachers can create journals');
      error.status = 403;
      throw error;
    }

    const journal = await Journal.create({
      description,
      teacher_id: req.user.id,
      published_at: published_at || null,
    });

    if (studentIds && studentIds.length) {
      const students = await User.findAll({
        where: { id: studentIds, role: 'Student' },
      });
      if (students.length !== studentIds.length) {
        const error = new Error('Invalid student IDs');
        error.status = 400;
        throw error;
      }
      await JournalStudent.bulkCreate(
        studentIds.map((id) => ({ journal_id: journal.id, student_id: id }))
      );
      for (const studentId of studentIds) {
        await sendNotification(
          studentId,
          journal.id,
          `You were tagged in a new journal: ${description}`
        );
      }
    }

    if (req.file) {
      await Attachment.create({
        journal_id: journal.id,
        type: req.file.mimetype.includes('image')
          ? 'Image'
          : req.file.mimetype.includes('video')
          ? 'Video'
          : 'PDF',
        url: `/uploads/${req.file.filename}`,
      });
    }

    res.status(201).json({ message: 'Journal created', journal_id: journal.id });
  } catch (err) {
    next(err);
  }
};

const updateJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, studentIds, published_at } = req.body;
    if (req.user.role !== 'Teacher') {
      const error = new Error('Only teachers can update journals');
      error.status = 403;
      throw error;
    }

    const journal = await Journal.findByPk(id);
    if (!journal) {
      const error = new Error('Journal not found');
      error.status = 404;
      throw error;
    }

    if (description) journal.description = description;
    if (published_at) journal.published_at = published_at;
    await journal.save();

    if (studentIds && studentIds.length) {
      const students = await User.findAll({
        where: { id: studentIds, role: 'Student' },
      });
      if (students.length !== studentIds.length) {
        const error = new Error('Invalid student IDs');
        error.status = 400;
        throw error;
      }
      await JournalStudent.destroy({ where: { journal_id: id } });
      await JournalStudent.bulkCreate(
        studentIds.map((studentId) => ({ journal_id: id, student_id: studentId }))
      );
      for (const studentId of studentIds) {
        await sendNotification(
          studentId,
          journal.id,
          `You were tagged in an updated journal: ${description}`
        );
      }
    }

    if (req.file) {
      await Attachment.destroy({ where: { journal_id: id } });
      await Attachment.create({
        journal_id: id,
        type: req.file.mimetype.includes('image')
          ? 'Image'
          : req.file.mimetype.includes('video')
          ? 'Video'
          : 'PDF',
        url: `/uploads/${req.file.filename}`,
      });
    }

    res.json({ message: 'Journal updated' });
  } catch (err) {
    next(err);
  }
};

const deleteJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'Teacher') {
      const error = new Error('Only teachers can delete journals');
      error.status = 403;
      throw error;
    }

    const journal = await Journal.findByPk(id);
    if (!journal) {
      const error = new Error('Journal not found');
      error.status = 404;
      throw error;
    }

    await journal.destroy();
    res.json({ message: 'Journal deleted' });
  } catch (err) {
    next(err);
  }
};

const publishJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'Teacher') {
      const error = new Error('Only teachers can publish journals');
      error.status = 403;
      throw error;
    }

    const journal = await Journal.findByPk(id);
    if (!journal) {
      const error = new Error('Journal not found');
      error.status = 404;
      throw error;
    }

    journal.published_at = new Date();
    await journal.save();
    res.json({ message: 'Journal published' });
  } catch (err) {
    next(err);
  }
};

const getTeacherFeed = async (req, res, next) => {
  try {
    if (req.user.role !== 'Teacher') {
      const error = new Error('Only teachers can access this feed');
      error.status = 403;
      throw error;
    }

    const journals = await Journal.findAll({
      where: { teacher_id: req.user.id },
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'username'],
        },
        {
          model: JournalStudent,
          include: [
            {
              model: User,
              as: 'student',
              attributes: ['id', 'username'],
            },
          ],
        },
        {
          model: Attachment,
          attributes: ['id', 'journal_id', 'type', 'url', 'created_at'],
        },
      ],
    });

    res.json(journals);
  } catch (err) {
    next(err);
  }
};

const getStudentFeed = async (req, res, next) => {
  try {
    if (req.user.role !== 'Student') {
      const error = new Error('Only students can access this feed');
      error.status = 403;
      throw error;
    }

    const journals = await Journal.findAll({
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'username'],
        },
        {
          model: JournalStudent,
          where: { student_id: req.user.id },
          include: [
            {
              model: User,
              as: 'student',
              attributes: ['id', 'username'],
            },
          ],
        },
        {
          model: Attachment,
          attributes: ['id', 'journal_id', 'type', 'url', 'created_at'],
        },
      ],
    });

    res.json(journals);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createJournal,
  updateJournal,
  deleteJournal,
  publishJournal,
  getTeacherFeed,
  getStudentFeed,
};