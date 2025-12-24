import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";


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

const TEMPLATE = process.env.TEMPLATE || "default"

const templatePath = `./templates/${TEMPLATE}.html`;
const template = await Bun.file(templatePath).text();

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
  .use(cors({ origin: true }))
  .get("/", ({ request }) => {
    return {
      status: "working",
      version: "1.0.0",
      documentation: "https://github.com/Wiredista/smtp-contact-api",
      swagger: `${request.url}swagger`
    }
  })
  .post("/contact", ({ body, request }) => {
    const { name, email, phone, subject, message, customField1, customField2, customField3 } = body;
    const mailOptions: Mail.Options = {
      from: SMTP_FROM,
      to: SMTP_TO,
      subject: `${SMTP_SUBJECT} - ${subject}`,
      html: template
        .replaceAll("{{origin}}", request.referrer || "unknown form")
        .replaceAll("{{name}}", name)
        .replaceAll("{{email}}", email)
        .replaceAll("{{phone}}", phone || "--")
        .replaceAll("{{message}}", message)
        .replaceAll("{{customField1Name}}", NAME_CUSTOM_FIELD_1)
        .replaceAll("{{customField1}}", customField1 || "--")
        .replaceAll("{{customField2Name}}", NAME_CUSTOM_FIELD_2)
        .replaceAll("{{customField2}}", customField2 || "--")
        .replaceAll("{{customField3Name}}", NAME_CUSTOM_FIELD_3)
        .replaceAll("{{customField3}}", customField3 || "--"),
        // ugly as f
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
