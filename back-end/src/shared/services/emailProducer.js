
const { getRabbitConnection } = require('../queues/rabbitmq');

async function sendEmailJob(emailData, routingKey) {
    try {
        const connection = await getRabbitConnection();
        const channel = await connection.createChannel();
        const exchange = "notificationExchange";

        await channel.assertExchange(exchange, "direct", {
          durable: true,
        });

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
    }
}

module.exports = {
  sendEmailJob,
};
