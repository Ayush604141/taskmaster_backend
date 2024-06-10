import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./services/DB.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import winston from "winston";
import morgan from "morgan";

dotenv.config();

const app = express();

connectDB();
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(bodyParser.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json());

app.use(cors({ origin: ["http://localhost:3000"] }));

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "combined.log",
    }),
  ],
});

const morganStream = {
  write: function (message) {
    logger.info(message.trim());
  },
};
app.use(morgan("combined", { stream: morganStream }));

app.get("/", (req, res) => {
  res.status(200).send(`This is the ${req.path} route`);
});

app.use(errorMiddleware);

export default app;
