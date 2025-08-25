const { startDLQConsumer } = require('./jobs/dlqConsumer');
const { startNotificationConsumer } = require('./jobs/notificationConsumer');


async function startAllConsumers() {
    const results = await Promise.allSettled([
        startNotificationConsumer(),
        startDLQConsumer()
    ]);

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
        console.error("Error starting consumers:", failed.map(f => f.reason));
        process.exit(1);
    } else {
        console.log("All consumers started successfully.");
    }
}

process.on("SIGINT", () => {
    console.log("Received SIGINT. Shutting down...");
    process.exit(0);
});

startAllConsumers();