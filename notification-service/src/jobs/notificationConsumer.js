const { getChannel } = require("../dispatcher/channelDispatcher");
const { getRabbitConnection } = require("../queues/rabbitmq");
const { sendNotification } = require("../services/emailService");

async function processNotification(notification) {
    const channel = getChannel("email");
    if (!channel) {
        throw new Error("No channel found for type: email");
    }
    await channel.send(notification);
}


async function startNotificationConsumer() {
    try {
        const connection = await getRabbitConnection();
        const channel = await connection.createChannel();

        const exchange = "notificationExchange";
        const queue = "notificationQueue";
        const routingKey = "notification.send";

        const dlqExchange = "notificationExchange.dlq";
        const dlqQueue = "notificationQueue.dlq";
        const dlqRoutingKey = "notification.dlq";

        // ✅ Declare exchange (safe, idempotent)
        await channel.assertExchange(exchange, "direct", { durable: true });

        // ✅ Consumer owns the queue
        await channel.assertQueue(queue, {
            durable: true,
            arguments: {
                "x-dead-letter-exchange": dlqExchange,
                "x-dead-letter-routing-key": dlqRoutingKey
            }
         });

        // ✅ Bind queue to exchange
        await channel.bindQueue(queue, exchange, routingKey);


        // Dead Letter Queue (DLQ) setup
        await channel.assertExchange(dlqExchange, "direct", { durable: true });
        await channel.assertQueue(dlqQueue, { durable: true });
        await channel.bindQueue(dlqQueue, dlqExchange, dlqRoutingKey);

        console.log("Waiting for messages in queue:", queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const notificationPayload = JSON.parse(msg.content.toString());
                    console.log("+-----------------------------------------------------------------+");
                    console.log("Received notification data:", notificationPayload);
                    console.log("+-----------------------------------------------------------------+");

                    await processNotification(notificationPayload);

                    channel.ack(msg); // Acknowledge the message
                } catch (err) {
                    console.error("Failed to process notification job:", err);
                    // Option: nack and requeue for retry, or ack to drop
                    channel.nack(msg, false, false);
                    // channel.ack(msg); // Ack to drop the message and avoid crash
                }
            }
        });
    } catch (error) {
        console.error("Error starting notification consumer:", error);

        throw new Error("Failed to start notification consumer");
    }
}

module.exports = {
  startNotificationConsumer
};
