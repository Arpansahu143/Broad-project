import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";

const PORT = env.PORT || 5000;

// Without these, a bug in an async path outside Express's request
// cycle (e.g. a stray unhandled Promise) crashes the process with
// no useful log line. Log it clearly, then exit so a process
// manager (nodemon/pm2/Docker) can restart cleanly.
process.on("uncaughtException", (err) => {
  logger.error({ message: "Uncaught Exception", error: err.message, stack: err.stack });
  console.error("UNCAUGHT EXCEPTION — shutting down:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ message: "Unhandled Rejection", reason });
  console.error("UNHANDLED PROMISE REJECTION — shutting down:", reason);
  process.exit(1);
});

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);

    console.log(`
======================================================
🎓        University MIS Backend Started
======================================================

Environment : ${env.NODE_ENV}
Port        : ${PORT}

Server URL  : http://localhost:${PORT}
API Base    : http://localhost:${PORT}/api/v1

======================================================
`);
});

export default server;