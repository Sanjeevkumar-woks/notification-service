import createHttpError from "http-errors";
import config from "config";
import { MailQueue } from "../connectors/mailQueue";
import { MailStatusModel } from "../models/mailStatusModel";
import {
  IMailStatusDocument,
  MailPriorityEnum,
  MailStatusEnum,
} from "../utils/mailSchema";
import { MailTemplatesEnum } from "../constants/Enums/mailEnums";
import { MAIL_TEMPLATE_META_DATA_VALIDATION_SCHEMA } from "../constants/mail";

export const sendMail = async (playLoad: {
  mailTemplateName: MailTemplatesEnum;
  recipient: string;
  metaData?: any;
  sender?: string;
  priority?: MailPriorityEnum;
}) => {
  const {
    mailTemplateName,
    recipient,
    metaData,
    sender = config.get("senderEmail") as string,
    priority,
  } = playLoad;
  const mailQueue = new MailQueue();

  const mailStatusDocs = await MailStatusModel.create({
    mailTemplateName,
    sender,
    recipient,
    metaData,
    priority,
  });

  await mailQueue.addMailToQueue({
    jobId: mailStatusDocs._id.toString(),
    mailTemplateName: mailTemplateName as string,
    sender,
    recipient,
    metaData,
  });
};

export const sendBulkMails = async (payload: {
  mailTemplateName: MailTemplatesEnum;
  sender?: string;
  priority?: MailPriorityEnum;
  recipientsData: {
    recipient: string;
    metaData?: any;
  }[];
}) => {
  const {
    mailTemplateName,
    sender = config.get("senderEmail") as string,
    priority = MailPriorityEnum.LOW,
    recipientsData,
  } = payload;

  console.log(payload, "Payload");

  const mailQueue = new MailQueue();

  const insertOperations =
    recipientsData?.map((recipientData) => ({
      mailTemplateName,
      sender,
      recipient: recipientData.recipient,
      metaData: recipientData.metaData,
      priority,
      status: MailStatusEnum.Pending,
    })) || [];

  const insertBatchSize = 1000;
  const insertPromises = [];
  const totalInsertOperations = insertOperations.length;

  for (let i = 0; i < totalInsertOperations; i += insertBatchSize) {
    insertPromises.push(
      MailStatusModel.insertMany(
        insertOperations.slice(i, i + insertBatchSize),
        {
          ordered: false,
        }
      )
    );
  }

  const insertPromiseResult = await Promise.all(insertPromises);
  const mailStatusDocs = insertPromiseResult.reduce(
    (acc, curr) => [...acc, ...curr],
    []
  );

  const validMails = [] as IMailStatusDocument[];
  const invalidMails = [] as any[];

  mailStatusDocs.forEach((doc) => {
    let errorMessage = "";
    const metaDataValidationSchema =
      MAIL_TEMPLATE_META_DATA_VALIDATION_SCHEMA[
        mailTemplateName as keyof typeof MAIL_TEMPLATE_META_DATA_VALIDATION_SCHEMA
      ];
    if (metaDataValidationSchema) {
      const { error } = metaDataValidationSchema.validate(doc.metaData || {});

      if (error?.message) {
        errorMessage = `Invalid Meta Data: ${error.message}`;
      }
    }

    if (errorMessage) {
      invalidMails.push({
        ...doc.toObject(),
        error: errorMessage,
      });
    } else {
      validMails.push(doc);
    }
  });
  // Bulk write operations for invalid mails to mark them as failed
  const invalidMailsUpdateOperations = invalidMails.map((doc) => {
    return {
      updateOne: {
        filter: { _id: doc._id },
        update: {
          status: MailStatusEnum.Failed,
          error: doc.error,
        },
      },
    };
  });

  const bulkWriteBatchSize = 1000;
  const bulkWritePromises = [];
  const totalBulkWriteOperations = invalidMailsUpdateOperations.length;

  for (let i = 0; i < totalBulkWriteOperations; i += bulkWriteBatchSize) {
    bulkWritePromises.push(
      MailStatusModel.bulkWrite(
        invalidMailsUpdateOperations.slice(i, i + bulkWriteBatchSize) as any[]
      )
    );
  }

  await Promise.all(bulkWritePromises);

  // Adding valid mails to queue
  if (validMails.length > 0) {
    await mailQueue.addBulkMailsToQueue({
      mailTemplateName: mailTemplateName as string,
      sender,
      recipientData: validMails.map((doc) => ({
        recipient: doc.recipient as string,
        metaData: doc.metaData,
        jobId: doc._id.toString(),
      })),
    });
  }
};
