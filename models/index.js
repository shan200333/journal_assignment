const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = require('./user.model')(sequelize, DataTypes);
const Journal = require('./journal.model')(sequelize, DataTypes);
const JournalStudent = require('./journalStudent.model')(sequelize, DataTypes);
const Attachment = require('./attachment.model')(sequelize, DataTypes);
const Notification = require('./notification.model')(sequelize, DataTypes);

User.hasMany(Journal, { foreignKey: 'teacher_id', as: 'journals' });
Journal.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

Journal.hasMany(JournalStudent, { foreignKey: 'journal_id' });
JournalStudent.belongsTo(Journal, { foreignKey: 'journal_id' });

User.hasMany(JournalStudent, { foreignKey: 'student_id', as: 'journalStudents' });
JournalStudent.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

Journal.hasMany(Attachment, { foreignKey: 'journal_id' });
Attachment.belongsTo(Journal, { foreignKey: 'journal_id' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Journal.hasMany(Notification, { foreignKey: 'journal_id' });
Notification.belongsTo(Journal, { foreignKey: 'journal_id' });

module.exports = {
  sequelize,
  User,
  Journal,
  JournalStudent,
  Attachment,
  Notification,
};