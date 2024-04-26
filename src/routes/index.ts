import { Router } from "express";
import { healthCheck } from "../controllers/healthCheckController";
import { mailAPis } from "./mailRoutes";
import { testApis } from "./testRoutes";

export const apis = Router();

apis.use("/healthcheck", healthCheck);
apis.use("/test", testApis);
apis.use("/mail", mailAPis);
//apis.use("/notification", notificationApis);
