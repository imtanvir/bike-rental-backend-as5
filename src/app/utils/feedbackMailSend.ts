import nodemailer from "nodemailer";
import config from "../config";

export const feedbackMailSend = async (to: string, message: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: config.node_env === "production" ? 465 : 587,
    secure: config.node_env === "production",
    auth: {
      user: "tanvirparvej101@gmail.com",
      pass: "ojbn nkva wwze trae",
    },
  });

  await transporter.sendMail({
    from: "tanvirparvej101@gmail.com", // sender address
    to,
    subject: "User Feedback Message", // Subject line
    text: message,
  });
};
