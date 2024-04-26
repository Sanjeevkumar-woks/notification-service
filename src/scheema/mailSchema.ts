import mongoose from "mongoose";

export enum MailPriorityEnum {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export enum MailStatusEnum {
  Pending = "Pending",
  Sent = "Sent",
  Failed = "Failed",
}

export interface IMailStatus {
  mailTemplateName: string;
  sender: string;
  recipient: string;
  sentAt?: Date;
  status: MailStatusEnum;
  error?: string;
  metaData?: Record<string, any>;
  priority: MailPriorityEnum;
}

export interface IMailStatusDocument extends IMailStatus, mongoose.Document {}

export const mailStatusSchema = new mongoose.Schema(
  {
    mailTemplateName: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(MailStatusEnum),
      default: MailStatusEnum.Pending,
    },
    error: {
      type: String,
    },
    metaData: {
      type: Object,
      default: {},
    },
    priority: {
      type: String,
      enum: Object.values(MailPriorityEnum),
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "MailStatus",
  }
);

export const MailStatusModelName = "MailStatus";
