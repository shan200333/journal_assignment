const { Notification } = require('../models/index');

async function sendNotification(userId, journalId, message) {
  await Notification.create({
    user_id: userId,
    journal_id: journalId,
    message,
  });
  console.log(`Notification sent to user ${userId}: ${message}`);
}

module.exports = { sendNotification };