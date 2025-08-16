const emailTemplates = {
  FORGOT_PASSWORD: ({ recipients, resetToken }) => ({
    to: recipients,
    subject: "Password Reset Request",
    text: `You requested a password reset. Please use the following link to reset your password: ${process.env.CLIENT_FRONTEND_URL}/api/auth/reset-password?token=${resetToken}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #2d8cf0;">Password Reset Request</h2>
          <p>You requested a password reset. Please use the button below to reset your password:</p>
          <a href="${process.env.CLIENT_FRONTEND_URL}/api/auth/reset-password?token=${resetToken}" 
             style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2d8cf0; color: #fff; text-decoration: none; border-radius: 4px;">
            Reset Your Password
          </a>
          <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  }),

  SIGNUP_SUCCESS: ({ recipients }) => ({
    to: recipients,
    subject: "Welcome to Restofy!!",
    text: `Thank you for signing up! We're excited to have you on board.`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #2d8cf0;">Welcome to Restofy!</h2>
          <p>Thank you for signing up! We're excited to have you on board.</p>
        </div>
      </div>
    `,
  }),

  RESET_PASSWORD_SUCCESS: ({ recipients }) => ({
    to: recipients,
    subject: "Password Reset Successful",
    text: `Your password has been successfully reset.`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #2d8cf0;">Password Reset Successful</h2>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
        </div>
      </div>
    `,
  }),

  RESERVATION_CONFIRMATION: (newReservation) => ({
    to: newReservation.email,
    subject: `Reservation Confirmation: ${newReservation.id}`,
    text: `Hi ${newReservation.firstName},\n\nYour reservation has been successfully created with ID: ${newReservation.id}.\nDetails:\n- Date & Time: ${newReservation.reservationTime}\n- Number of Guests: ${newReservation.numberOfGuests}\n- Special Requests: ${newReservation.specialRequests || "None"}\n\nThank you for choosing us!`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #2d8cf0;">Reservation Confirmation</h2>
          <p>Hi <strong>${newReservation.firstName}</strong>,</p>
          <p>Your reservation has been successfully created with ID: <strong>${newReservation.id}</strong>.</p>
          <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Date & Time:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${newReservation.reservationTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Number of Guests:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${newReservation.numberOfGuests}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Special Requests:</td>
              <td style="padding: 8px;">${newReservation.specialRequests || "None"}</td>
            </tr>
          </table>
          <p>Thank you for choosing us!</p>
        </div>
      </div>
    `,
  }),

  RESERVATION_CANCELLATION: (cancellationDetails) => ({
    to: cancellationDetails.email,
    subject: `Reservation Cancellation: ${cancellationDetails.id}`,
    text: `Hi ${cancellationDetails.firstName},\n\nWe're sorry to inform you that your reservation with ID: ${cancellationDetails.id} has been cancelled.\n\nThank you for your understanding.`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #e74c3c;">Reservation Cancelled</h2>
          <p>Hi <strong>${cancellationDetails.firstName}</strong>,</p>
          <p>We're sorry to inform you that your reservation with ID: <strong>${cancellationDetails.id}</strong> has been cancelled.</p>
          <p>Thank you for your understanding.</p>
        </div>
      </div>
    `,
  }),

  PAYMENT_CONFIRMATION: (bill) => ({
    to: bill.customerEmail,
    subject: `Payment Confirmation for Reservation ID: ${bill.reservationId}`,
    text: `Hi ${bill.customerName},\n\nYour payment of ${bill.totalAmount} has been successfully processed.\n\nThank you for dining with us!`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #27ae60;">Payment Confirmation</h2>
          <p>Hi <strong>${bill.customerName}</strong>,</p>
          <p>Your payment of <strong>${bill.totalAmount}</strong> has been successfully processed for reservation ID: <strong>${bill.reservationId}</strong>.</p>
          <p>Thank you for dining with us!</p>
        </div>
      </div>
    `,
  }),
};

module.exports = emailTemplates;
