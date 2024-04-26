import { Router } from "express";
import asyncFunction from "express-async-handler";
import * as mailController from "../controllers/mailControllers";

export const mailAPis = Router();

mailAPis.post("/sendMail", asyncFunction(mailController.sendEmail));

mailAPis.post("/sendBulkMails", asyncFunction(mailController.sendBulkMails));
