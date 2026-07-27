import fs from "fs";
import path from "path";
import winston from "winston";

const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "application.log"),
    }),

    new winston.transports.Console(),
  ],
});

export default logger;