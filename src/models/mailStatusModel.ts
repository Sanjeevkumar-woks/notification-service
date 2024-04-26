import mongoose from "mongoose";
import {
  IMailStatusDocument,
  MailStatusModelName,
  mailStatusSchema,
} from "../utils/mailSchema";

export const MailStatusModel = mongoose.model<IMailStatusDocument>(
  MailStatusModelName,
  mailStatusSchema
);
