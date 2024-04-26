import config from "config";
import { getRedisClient } from "../connectors/redis";
import { Worker } from "bullmq";
import { MailTemplatesEnum } from "../constants/Enums/mailEnums";
import { sendMail } from "../utils/mailer";
import { MailStatusModel } from "../models/mailStatusModel";
import { MailStatusEnum } from "../utils/mailSchema";

const mailQueueName = config.get("mailQueueName") as string;

export const startMailWorker = async () => {
  const redisClient = getRedisClient();
  const mailWorker = new Worker(
    mailQueueName,
    async (job) => {
      try {
        {
          console.log(`Mail worker: Starting job id ${job.id}`);

          const data = job.data as {
            mailTemplateName: MailTemplatesEnum;
            sender: string;
            recipient: string;
            metaData?: any;
          };

          const html = `<h1>Hi</h1>`;

          // const html = await htmlFromEjs({
          //   templateName: data.mailTemplateName,
          //   metaData: data.metaData || {},
          // });

          const mailOptions = {
            from: data.sender,
            to: data.recipient,
            subject: "Test",
            html: html as string,
          };

          sendMail(mailOptions);

          await MailStatusModel.findOneAndUpdate(
            {
              _id: job.id,
            },
            {
              status: MailStatusEnum.Sent,
              sentAt: new Date(),
            }
          );
        }
      } catch (err: any) {
        await MailStatusModel.findOneAndUpdate(
          {
            _id: job.id,
          },
          {
            status: MailStatusEnum.Failed,
            error: err.message,
          }
        );

        console.error(
          `Mail worker: Error processing job id ${job.id}, error: ${err}`
        );
      }
    },
    {
      autorun: false,
      connection: redisClient,
      limiter: {
        max: 10,
        duration: 1000,
      },
    }
  );

  await mailWorker.run();
};
