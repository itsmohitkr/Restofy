
const { getRabbitConnection } = require('../queues/rabbitmq');

async function sendEmailJob(emailData, routingKey) {
    try {
        const connection = await getRabbitConnection();
        const channel = await connection.createChannel();
        const exchange = "notificationExchange";

        await channel.assertExchange(exchange, "direct", {
          durable: true,
        });

        // await channel.assertQueue("notificationQueue", { durable: true });
        // await channel.bindQueue(
        //   "notificationQueue",
        //   exchange,
        //   "notification.send"
        // );

        channel.publish(
          exchange,
          routingKey,
          Buffer.from(JSON.stringify(emailData)),
          {
            persistent: true,
          }
        );
        
        console.log("Email sent to queue:", emailData);
    } catch (error) {
        console.error("Error sending email to queue:", error);
        throw new Error("Failed to send email to queue");
    }
  
}

module.exports = {
  sendEmailJob,
};
