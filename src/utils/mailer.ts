import * as nodemailer from "nodemailer";

interface SendMailInterface {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = (payload: SendMailInterface) => {
  try {
    transporter.sendMail(payload, (error, info) => {
      if (error) {
        throw new Error(`
        NodeMailer: Error sending email: ${error}
       `);
      } else {
        console.info(`NodeMailer: Email sent: ${info.response}`);
      }
    });
  } catch (err) {
    throw new Error(`Error sending mail: ${err}`);
  }
};
