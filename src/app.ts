import express from "express";
import * as bodyPasser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { healthCheck } from "./controllers/healthCheckController";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(bodyPasser.json());
app.use(cookieParser());

//app.use("/notification-service", apis);
app.use("/healthcheck", healthCheck);

process.on("uncaughtException", function (err: Error) {
  console.log("uncaughtException", err);
});

process.on("unhandledRejection", function (err: Error) {
  console.log("unhandledRejection", err);
});

export default app;
