class NotificationChannel{
    async send(payload) {
        throw new Error("send() must be implemented by subclass");
    }
}

module.exports = NotificationChannel;

