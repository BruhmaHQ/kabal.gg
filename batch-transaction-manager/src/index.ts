import Express, { Response, Request, NextFunction } from "express";
import { config } from "dotenv";
import cors from "cors";
import logger from "./services/logger.service";
import morgan from "morgan";
import helmet from "helmet";
import errorHandler from "./errors/error.handler";
import { errors } from "./errors/error.constants";
import { db } from "./utils/db";

config();

const app = Express();

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await db();
    logger.info("Database connection initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize database connection:", error);
    process.exit(1);
  }
};

app.use(Express.json());
app.use(cors());
app.set("trust proxy", true);
app.use(Express.json({ limit: "10kb" }));
app.use(Express.urlencoded({ extended: true, limit: "10kb" }));
app.use(helmet());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.debug(message),
    },
  })
);
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res
    .status(errors.METHOD_NOT_ALLOWED.errorCode)
    .json(errors.METHOD_NOT_ALLOWED);
});

app.use(errorHandler());

const startServer = async () => {
  await initializeDatabase();
  app.listen(process.env.PORT!, () => {
    if (process.env.NODE_ENV === "development") {
      logger.info(
        `🚀 Server:::${process.env.NODE_ENV} running on Port: ${process.env.PORT} 🚀`
      );
    }
  });
};

startServer();
