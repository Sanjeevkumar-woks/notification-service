import {Request,Response} from 'express';
import config from 'config';
import Joi, { object } from 'joi';
import { validateJoiSchema } from '../utils/validationSchema';import { MailTemplatesEnum } from '../constants/Enums/mailEnums';
}


export const sendEmail= async(req:Request,res:Response)=>{
const {mailTemplateName,recipient,metaData,sender}=req.body;

validateJoiSchema({
    schema: Joi.object({
      mailTemplateName: Joi.string()
        .valid(...Object.values(MailTemplatesEnum))
        .required(),
      recipient: Joi.string().email().required()
    }),
    data: { mailTemplateName, recipient }
  });

   await mailService.sendMail({
    mailTemplateName,
    recipient,
    metaData,
    sender,
   });

   res.send('Mail Sent Successfully');

}

