import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";

const PORT = env.PORT || 5000;

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