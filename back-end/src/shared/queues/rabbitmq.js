const amqp = require("amqplib");

let connection;

async function getRabbitConnection() {
  if (!connection) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }
  return connection;
}

module.exports = {
  getRabbitConnection,
};
