import { Request, Response } from "express";
import config from "config";
import Joi from "joi";
import { validateJoiSchema } from "../utils/validationSchema";
import { MailTemplatesEnum } from "../constants/Enums/mailEnums";
import * as mailService from "../services/mailService";
export const sendEmail = async (req: Request, res: Response) => {
  const { mailTemplateName, recipient, metaData, sender, priority } = req.body;

  validateJoiSchema({
    schema: Joi.object({
      mailTemplateName: Joi.string()
        .valid(...Object.values(MailTemplatesEnum))
        .required(),
      recipient: Joi.string().email().required(),
    }),
    data: { mailTemplateName, recipient },
  });

  await mailService.sendMail({
    mailTemplateName,
    recipient,
    metaData,
    sender,
    priority,
  });

  res.send("Mail Sent Successfully");
};

export const sendBulkMails = async (req: Request, res: Response) => {
  const { mailTemplateName, sender, priority, recipientsData } = req.body;
  validateJoiSchema({
    schema: Joi.object({
      mailTemplateName: Joi.string()
        .valid(...Object.values(MailTemplatesEnum))
        .required(),
      recipientsData: Joi.array()
        .items(
          Joi.object({
            recipient: Joi.string().email().required(),
          }).unknown(true)
        )
        .required()
        .min(1),
    }),
    data: {
      mailTemplateName,
      recipientsData,
    },
  });

  await mailService.sendBulkMails({
    mailTemplateName,
    sender,
    priority,
    recipientsData,
  });

  res.send("Bulk mails sent successfully");
};
