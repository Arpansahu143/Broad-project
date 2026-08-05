import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import hpp from "hpp";

import { generalLimiter } from "./middlewares/rateLimiter.js";
import requestId from "./middlewares/requestId.js";
import requestLogger from "./middlewares/requestLogger.js";

import routes from "./routes/index.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

/* ==========================================
   Global Middlewares
========================================== */

app.use(helmet());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(compression());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

app.use(hpp());

app.use(morgan("dev"));

/* ==========================================
   Custom Middlewares
========================================== */

app.use(requestId);
app.use(requestLogger);

/* ==========================================
   Health Check
========================================== */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "University MIS Backend Running",
        timestamp: new Date().toISOString(),
    });
});

/* ==========================================
   API Routes
========================================== */

app.use("/api/v1", generalLimiter, routes);

/* ==========================================
   Error Handling
========================================== */

app.use(notFound);

app.use(errorHandler);

export default app;