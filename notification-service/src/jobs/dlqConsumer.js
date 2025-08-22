const { getChannel } = require("../dispatcher/channelDispatcher");
const { getRabbitConnection } = require("../queues/rabbitmq");

async function processNotification(notification) {
  const channel = getChannel("email");
  if (!channel) {
    throw new Error("No channel found for type: email");
  }
  await channel.send(notification);
}



async function startDLQConsumer() {
  try {
    const connection = await getRabbitConnection();
    const channel = await connection.createChannel();
    const dlq = "notificationQueue.dlq";

    console.log("Waiting for messages in DLQ:", dlq);

    channel.consume(dlq, async (msg) => {
      if (msg !== null) {
        try {
          const notificationPayload = JSON.parse(msg.content.toString());
          console.log(
            "+-----------------------------------------------------------------+"
          );
          console.log(
            "Received notification from DLQ:",
            notificationPayload
          );
          console.log(
            "+-----------------------------------------------------------------+"
          );
         
          // Process the notification (e.g., send a push notification)
          await processNotification(notificationPayload);

          channel.ack(msg); // Success
        } catch (err) {
          console.error("Failed to process notification from DLQ:", err);
          // Send to DLQ (do not requeue)
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error("Error starting DLQ consumer:", error);
    throw new Error("Failed to start DLQ consumer");
  }
}

module.exports = {
  startDLQConsumer
};
