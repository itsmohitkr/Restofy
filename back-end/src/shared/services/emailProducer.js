
const { getRabbitConnection } = require('../queues/rabbitmq');

async function sendEmailJob(emailData) {
    try {
        const connection = await getRabbitConnection();
        const channel = await connection.createChannel();
        const queue = "emailQueue";
        const exchange = "emailExchange";
        const routingKey = "email.send";

        await channel.assertExchange(exchange, "direct", { durable: true });

        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);
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
