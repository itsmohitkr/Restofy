const { getRabbitConnection } = require("../queues/rabbitmq");
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
                try {
                    const notificationPayload = JSON.parse(msg.content.toString());
                    console.log("+-----------------------------------------------------------------+");
                    console.log("Received notification data:", notificationPayload);
                    console.log("+-----------------------------------------------------------------+");

                    // Process the notification (e.g., send a push notification)
                    await sendNotification(notificationPayload);

                    channel.ack(msg); // Acknowledge the message
                } catch (err) {
                    console.error("Failed to process notification job:", err);
                    // Option: nack and requeue for retry, or ack to drop
                    // channel.nack(msg, false, true); // Uncomment to retry
                    channel.ack(msg); // Ack to drop the message and avoid crash
                }
            }
        });
    } catch (error) {
        console.error("Error starting notification consumer:", error);

        throw new Error("Failed to start notification consumer");
    }
}

startNotificationConsumer();
