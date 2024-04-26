import { Queue } from "bullmq";
import IORedis from "ioredis";
import config from "config";
import { getRedisClient } from "./redis";
import { join } from "path";

const mailQueueName = config.get("mailQueueName") as string;

export class MailQueue {
  private redisClient: IORedis;
  private mailQueue: Queue;

  constructor() {
    this.redisClient = getRedisClient();
    this.mailQueue = new Queue(mailQueueName, { connection: this.redisClient });
  }

  public async addMailToQueue(playLoad: {
    jobId: string;
    mailTemplateName: string;
    sender: string;
    recipient: string;
    metaData: string;
  }) {
    const { mailTemplateName, sender, recipient, metaData, jobId } = playLoad;

    await this.mailQueue.add(
      mailQueueName,
      {
        mailQueueName,
        sender,
        recipient,
        metaData,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
        jobId,
      }
    );

    console.log(`Added Mail to Queue ${jobId}`);
  }

  public async addBulkMailsToQueue(playLoad: {
    mailTemplateName: string;
    sender: string;
    recipientData: {
      recipient: string;
      metaData?: Record<string, any>;
      jobId: string;
    }[];
  }) {
    const { mailTemplateName, sender, recipientData } = playLoad;

    const jobs = recipientData.map((recipientData) => {
      const { recipient, metaData, jobId } = recipientData;

      return {
        name: mailTemplateName,
        data: {
          mailTemplateName,
          sender,
          recipient,
          metaData,
        },
        pts: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      };
    });

    await this.mailQueue.addBulk(jobs);

    console.info(`Added bulk mails to QUeue: ${jobs.length}`);
  }
}
