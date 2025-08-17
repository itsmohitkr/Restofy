require("dotenv").config();
const nodemailer = require("nodemailer");
const emailTemplates = require("../utils/templates/emailTemplates");
const emailTemplatesHelper = require("../utils/helper/emailTemplatesHelper");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail password or app-specific password
  },
});

const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries - 1) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  throw new Error(
    `Failed to send email after ${maxRetries} attempts: ${lastError.message}`
  );
};


async function sendNotification(notificationPayload) {
  const { type, recipients, variables = {} } = notificationPayload;

  const emailTemplate = emailTemplatesHelper(type, variables);
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: recipients,
    subject: emailTemplate.subject,
    text: emailTemplate.text,
    html: emailTemplate.html,
  };
  try {
    return await sendEmailWithRetry(mailOptions, 3);
  } catch (error) {
    throw new Error("Failed to send notification");
  }
}

module.exports = {
  sendNotification,
};
