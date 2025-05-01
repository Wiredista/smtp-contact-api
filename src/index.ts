import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import nodemailer from "nodemailer";


const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const SMTP_FROM = process.env.SMTP_FROM;
const SMTP_TO = process.env.SMTP_TO;
const SMTP_SUBJECT = process.env.SMTP_SUBJECT;

const NAME_CUSTOM_FIELD_1 = process.env.NAME_CUSTOM_FIELD_1 || "Custom Field 1";
const NAME_CUSTOM_FIELD_2 = process.env.NAME_CUSTOM_FIELD_2 || "Custom Field 2";
const NAME_CUSTOM_FIELD_3 = process.env.NAME_CUSTOM_FIELD_3 || "Custom Field 3";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying SMTP connection:", error);
  } else {
    console.log("SMTP connection verified successfully");
  }
});

const app = new Elysia()
  .use(swagger())
  .post("/contact", ({ body }) => {
    const { name, email, phone, subject, message, customField1, customField2, customField3 } = body;
    const mailOptions = {
      from: SMTP_FROM,
      to: SMTP_TO,
      subject: `${subject || SMTP_SUBJECT || "Contact Form Submission"}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "--"}
Message: ${message}
${NAME_CUSTOM_FIELD_1}: ${customField1 || "--"}
${NAME_CUSTOM_FIELD_2}: ${customField2 || "--"}
${NAME_CUSTOM_FIELD_3}: ${customField3 || "--"}
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Error sending email" };
      } else {
        console.log("Email sent:", info.response);
        return { success: true, message: "Email sent successfully" };
      }
    }); 
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      phone: t.Optional(t.String()),
      subject: t.Optional(t.String()),
      message: t.String(),
      customField1: t.Optional(t.String()),
      customField2: t.Optional(t.String()),
      customField3: t.Optional(t.String())
    })
  })
  .listen(3000)
  
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
