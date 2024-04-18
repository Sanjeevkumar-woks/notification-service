import { Router } from "express";
import { healthCheck } from "../controllers/healthCheckController";

export const apis = Router();

apis.use("/healthcheck", healthCheck);
// apis.use("/notification", notificationApis);
