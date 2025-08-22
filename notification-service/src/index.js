const { startDLQConsumer } = require('./jobs/dlqConsumer');
const { startNotificationConsumer } = require('./jobs/notificationConsumer');

async function startAllConsumers() {
    try {
        await Promise.allSettled([
            startNotificationConsumer(),
            startDLQConsumer()
        ]);
        console.log("All consumers started successfully.");

    } catch (error) {
        console.error("Error starting consumers:", error);
        process.exit(1);
    }
}

process.on("SIGINT", () => {
    console.log("Received SIGINT. Shutting down...");
    process.exit(0);
});

startAllConsumers();