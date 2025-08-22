const NotificationChannel = require('./NotificationChannel');
const { sendNotification } = require('../services/emailService');

class EmailChannel extends NotificationChannel{
    async send(payload) {
        return sendNotification(payload);
    }
}

module.exports = EmailChannel;

