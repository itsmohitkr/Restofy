const { getRabbitConnection } = require("../../shared/queues/rabbitmq");
const { sendNotification } = require("../services/emailService");


async function startNotificationConsumer() {
    try {
        const connection = await getRabbitConnection();
        const channel = await connection.createChannel();
        const queue = "notificationQueue";

        await channel.assertQueue(queue, { durable: true });
        console.log("Waiting for messages in queue:", queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const notificationData = JSON.parse(msg.content.toString());
                console.log("Received notification data:", notificationData);

                // Process the notification (e.g., send a push notification)
                await sendNotification(notificationData);

                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error("Error starting notification consumer:", error);
        throw new Error("Failed to start notification consumer");
    }
}

startNotificationConsumer();
