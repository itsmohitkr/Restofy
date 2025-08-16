require("dotenv").config();
const nodemailer = require("nodemailer");
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

async function sendResetEmail(email, resetToken) {
  const resetLink = `${process.env.CLIENT_FRONTEND_URL}/api/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: email, // Recipient's email address
    subject: "Password Reset Request",
    text: `You requested a password reset. Please use the following link to reset your password: ${resetLink}`,
    html: `<p>You requested a password reset. Please use the following link to reset your password:</p>
               <a href="${resetLink}">Reset Your Password</a>`,
  };
  try {
    return await sendEmailWithRetry(mailOptions, 3);
  } catch (error) {
    throw new Error("Failed to send reset email");
  }
}

async function sendNotification(notificationData) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: notificationData.to, // Recipient's email address
    subject: notificationData.subject,
    text: notificationData.body,
    html: `<p>${notificationData.body}</p>`,
  };
  try {
    return await sendEmailWithRetry(mailOptions, 3);
  } catch (error) {
    throw new Error("Failed to send notification");
  }
}

module.exports = {
  sendResetEmail,
  sendNotification,
};
