const { Sequelize } = require('sequelize');
const sequelize = require('../config/db.config');

const User = require('./user.model')(sequelize);
const Journal = require('./journal.model')(sequelize);
const JournalStudent = require('./journalStudent.model')(sequelize);
const Attachment = require('./attachment.model')(sequelize);

Journal.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
Journal.hasMany(JournalStudent, { foreignKey: 'journal_id', as: 'JournalStudents' });
Journal.hasMany(Attachment, { foreignKey: 'journal_id', as: 'Attachments' });

JournalStudent.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });
JournalStudent.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

Attachment.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });

module.exports = {
  sequelize,
  User,
  Journal,
  JournalStudent,
  Attachment,
};
