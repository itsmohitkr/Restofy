const emailTemplates = {
  FORGOT_PASSWORD: {
    subject: "Password Reset Request",
    text: `You requested a password reset. Please use the following link to reset your password: ${process.env.CLIENT_FRONTEND_URL}/api/auth/reset-password?token=${resetToken}`,
    html: `<p>You requested a password reset. Please use the following link to reset your password:</p>
               <a href="${process.env.CLIENT_FRONTEND_URL}/api/auth/reset-password?token=${resetToken}">Reset Your Password</a>`,
  },

  SIGNUP_SUCCESS: {
    subject: "Welcome to Restofy!!",
    text: `Thank you for signing up! We're excited to have you on board.`,
    html: `<p>Thank you for signing up! We're excited to have you on board.</p>`,
  },

  RESET_PASSWORD_SUCCESS: {
    subject: "Password Reset Successful",
    text: `Your password has been successfully reset.`,
    html: `<p>Your password has been successfully reset.</p>`,
  },

  RESERVATION_CONFIRMATION: {
      subject: `Reservation Confirmation: ${newReservation.id}`,
      text: `Hi ${newReservation.firstName},\n\nYour reservation has been successfully created with ID: ${newReservation.id}.\nDetails:\n- Date & Time: ${newReservation.reservationTime}\n- Number of Guests: ${newReservation.numberOfGuests}\n- Special Requests: ${newReservation.specialRequests || "None"}\n\nThank you for choosing us!`,
      html: `<p>Hi ${newReservation.firstName},</p>
             <p>Your reservation has been successfully created with ID: ${newReservation.id}.</p>
             <p>Details:</p>
             <ul>
               <li>Date & Time: ${newReservation.reservationTime}</li>
               <li>Number of Guests: ${newReservation.numberOfGuests}</li>
               <li>Special Requests: ${newReservation.specialRequests || "None"}</li>
             </ul>
             <p>Thank you for choosing us!</p>`,
  },
};
