import { Router } from "express";
import { healthCheck } from "../controllers/healthCheckController";
import { mailAPis } from "./mailRoutes";

export const apis = Router();

apis.use("/healthcheck", healthCheck);
apis.use("/mail", mailAPis);
//apis.use("/notification", notificationApis);
