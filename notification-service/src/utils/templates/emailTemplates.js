const emailTemplates = {
  FORGOT_PASSWORD: {
    subject: "Password Reset Request",
    text: `You requested a password reset. Please use the following link to reset your password: ${process.env.CLIENT_FRONTEND_URL}/api/auth/reset-password?token={{resetToken}}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #2d8cf0;">Password Reset Request</h2>
          <p>You requested a password reset. Please use the button below to reset your password:</p>
          <a href="${process.env.CLIENT_FRONTEND_URL}/api/auth/reset-password?token={{resetToken}}" 
             style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2d8cf0; color: #fff; text-decoration: none; border-radius: 4px;">
            Reset Your Password
          </a>
          <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  },

  SIGNUP_SUCCESS: {
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
  },

  RESET_PASSWORD_SUCCESS: {
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
  },

  RESERVATION_CONFIRMATION: {
    subject: "Reservation Confirmation: {{id}}",
    text: `Hi {{firstName}},\n\nYour reservation has been successfully created with ID: {{id}}.\nDetails:\n- Date & Time: {{reservationTime}}\n- Number of Guests: {{numberOfGuests}}\n- Special Requests: {{specialRequests}}\n\nThank you for choosing us!`,
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
        <h2 style="color: #2d8cf0;">Reservation Confirmation</h2>
        <p>Hi <strong>{{firstName}}</strong>,</p>
        <p>Your reservation has been successfully created with ID: <strong>{{id}}</strong>.</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Date & Time:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">{{reservationTime}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Number of Guests:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">{{numberOfGuests}}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Special Requests:</td>
            <td style="padding: 8px;">{{specialRequests}}</td>
          </tr>
        </table>
        <p>Thank you for choosing us!</p>
      </div>
    </div>
  `,
  },

  RESERVATION_CANCELLATION: {
    subject: `Reservation Cancellation: {{id}}`,
    text: `Hi {{firstName}},\n\nWe're sorry to inform you that your reservation with ID: {{id}} has been cancelled.\n\nThank you for your understanding.`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #e74c3c;">Reservation Cancelled</h2>
          <p>Hi <strong>{{firstName}}</strong>,</p>
          <p>We're sorry to inform you that your reservation with ID: <strong>{{id}}</strong> has been cancelled.</p>
          <p>Thank you for your understanding.</p>
        </div>
      </div>
    `,
  },

  PAYMENT_CONFIRMATION: {
    subject: `Payment Confirmation for Reservation ID: {{reservationId}}`,
    text: `Hi {{customerName}},\n\nYour payment of {{totalAmount}} has been successfully processed.\n\nThank you for dining with us!`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
          <h2 style="color: #27ae60;">Payment Confirmation</h2>
          <p>Hi <strong>{{customerName}}</strong>,</p>
          <p>Your payment of <strong>{{totalAmount}}</strong> has been successfully processed for reservation ID: <strong>{{reservationId}}</strong>.</p>
          <p>Thank you for dining with us!</p>
        </div>
      </div>
    `,
  },
};

module.exports = emailTemplates;
