require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
const emailTemplatesHelper = require("../utils/helper/emailTemplatesHelper");
const generateInvoice = require("../utils/generateInvoicePdf");
const { v4: uuidv4 } = require("uuid");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries - 1) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  throw new Error(
    `Failed to send email after ${maxRetries} attempts: ${lastError.message}`
  );
};

async function getAttachment(params) {
  return {
    filename: `invoice-${params.id}.pdf`,
    content: await generateInvoice({ ...params }),
    contentType: "application/pdf",
  };
}

async function sendNotification(notificationPayload) {
  let notificationRecord = null;
  try {
    const {
      type,
      recipients,
      variables = {},
      userId = "",
    } = notificationPayload;

    const emailTemplate = emailTemplatesHelper(type, variables);

    let attachments = [];
    if (emailTemplate.attachmentRequired) {
      try {
        attachments = [await getAttachment(variables)];
      } catch (err) {
        // Log and continue without attachment
        console.error("Attachment generation failed:", err);
      }
    }

    const notificationData = {
      userId: userId || "",
      channel: "EMAIL",
      notificationType: type,
      recipient: recipients,
      payload: {
        subject: emailTemplate.subject,
        text: emailTemplate.text,
        html: emailTemplate.html,
        attachments,
      },
      status: "PENDING",
    };

    // 1. Try to insert notification record in DB, but continue even if it fails
    try {
      notificationRecord = await prisma.notification.create({
        data: notificationData,
      });
      console.log("Notification record created in database:", notificationRecord.id);
    } catch (dbError) {
      console.warn("Could not create notification record in database, but will still send email:", dbError.message);
      // Continue without database record
    }

    // 2. send the mail
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: recipients,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
      attachments,
    };

    const info = await sendEmailWithRetry(mailOptions, 3);
    console.log("Email sent successfully:", info);

    // 3. once the mail is sent, update the record if it exists
    if (notificationRecord && notificationRecord.id) {
      try {
        await prisma.notification.update({
          where: { id: notificationRecord.id },
          data: { status: "SENT", sentAt: new Date() },
        });
      } catch (dbError) {
        console.warn("Could not update notification record, but email was sent successfully:", dbError.message);
      }
    }
  } catch (error) {
    if (notificationRecord) {
      try {
        await prisma.notification.update({
          where: { id: notificationRecord.id },
          data: {
            status: "FAILED",
            error_message: error.toString(),
            updatedAt: new Date(),
          },
        });
      } catch (updateError) {
        console.error("Failed to update notification status:", updateError);
      }
    }
    console.error("Error sending notification:", error);
    // Optionally rethrow or handle as needed
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  sendNotification,
};

// if (require.main === module) {
//   sendNotification({
//     type: "PAYMENT_CONFIRMATION",
//     recipients: "mohtkumar3005@gmail.com",
//     userId: "your-real-user-id-here",
//     variables: {
//       id: 10,
//       totalAmount: 1760,
//       status: "Unpaid",
//       restaurantName: "orange king",
//       restaurantEmail: "info@sampleculinary.com",
//       restaurantPhoneNumber: "5551234567",
//       restaurantAddress: "123 Sample St, Food City",
//       customerName: "Rohan",
//       customerPhoneNumber: "7062346051",
//       customerEmail: "mohtkumar3005@gmail.com",
//       restaurantId: 1,
//       reservationId: 20,
//       orderId: 10,
//       createdAt: "2025-08-17T15:53:31.494Z",
//       updatedAt: "2025-08-17T15:53:31.494Z",
//       items: [
//         {
//           id: 28,
//           itemName: "maggie",
//           menuItemId: 1,
//           price: 240,
//           quantity: 2,
//           totalPrice: 480,
//           billId: 10,
//           createdAt: "2025-08-17T15:53:31.497Z",
//           updatedAt: "2025-08-17T15:53:31.497Z",
//         },
//         {
//           id: 29,
//           itemName: "paneer",
//           menuItemId: 2,
//           price: 240,
//           quantity: 3,
//           totalPrice: 720,
//           billId: 10,
//           createdAt: "2025-08-17T15:53:31.497Z",
//           updatedAt: "2025-08-17T15:53:31.497Z",
//         },
//         {
//           id: 30,
//           itemName: "pizza",
//           menuItemId: 3,
//           price: 140,
//           quantity: 4,
//           totalPrice: 560,
//           billId: 10,
//           createdAt: "2025-08-17T15:53:31.497Z",
//           updatedAt: "2025-08-17T15:53:31.497Z",
//         },
//       ],
//     },
//     generatePdf: true,
//     userId: "your-real-user-id-here",
//   }).catch((err) => {
//     console.error("Unhandled error in sendNotification:", err);
//   });
// }
