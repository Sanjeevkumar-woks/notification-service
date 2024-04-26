import Joi from "joi";
import { MailTemplatesEnum } from "./Enums/mailEnums";

export const inviteUserSchema = Joi.object({
  invitedByEmail: Joi.string().required(),
  companyName: Joi.string().required(),
  inviteLink: Joi.string().required(),
});

export const MAIL_TEMPLATE_META_DATA_VALIDATION_SCHEMA = {
  [MailTemplatesEnum.INVITE_USER]: inviteUserSchema,
};
