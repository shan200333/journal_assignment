module.exports = (sequelize, DataTypes) => {
  const JournalStudent = sequelize.define('JournalStudent', {
    journal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, {
    tableName: 'Journal_Students',
    timestamps: false,
  });

  return JournalStudent;
};