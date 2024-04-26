import mongoose from "mongoose";
import {
  IMailStatusDocument,
  MailStatusModelName,
  mailStatusSchema,
} from "../scheema/mailSchema";

export const MailStatusModel = mongoose.model<IMailStatusDocument>(
  MailStatusModelName,
  mailStatusSchema
);
