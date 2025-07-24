// server.js

require("dotenv").config(); // Load environment variables from .env
const app = require("./app");
const prisma = require("./infrastructure/database/prisma/client");
const { exec } = require("child_process");

const PORT = process.env.PORT || 3001;

// Run Prisma migrations before starting the server
exec("npx prisma migrate deploy", (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Prisma migration failed:", error.message);
    prisma.$disconnect();
    process.exit(1);
  }

  console.log("✅ Prisma migration success.");

  app.listen(PORT, () => {
    console.log(`🚀 Restofy server is running at http://localhost:${PORT}`);
  });
});

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("\n🔌 Prisma disconnected. Server shutting down.");
  process.exit(0);
});
