
const { getRabbitConnection } = require('../../shared/queues/rabbitmq');
const { sendResetEmail } = require('../services/emailService');

async function startEmailConsumer() {
    try {
        const connection = await getRabbitConnection();
        const channel = await connection.createChannel();
        const queue = "emailQueue";

        await channel.assertQueue(queue, { durable: true });
        console.log("Waiting for messages in queue:", queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const emailData = JSON.parse(msg.content.toString());
                console.log("Received email data:", emailData);
                
                await sendResetEmail(emailData.email, emailData.token);

                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error("Error starting email consumer:", error);
        throw new Error("Failed to start email consumer");
    }
    
}
startEmailConsumer();
