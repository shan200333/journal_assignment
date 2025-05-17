const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JournalStudent = sequelize.define('JournalStudent', {
    journal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Journals',
        key: 'id',
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    tableName: 'Journal_Students',
    timestamps: false,
  });

  return JournalStudent;
};