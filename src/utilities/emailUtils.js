import nodemailer from "nodemailer";

// Create a Nodemailer transporter using Gmail (with an app password)
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ad6b3722abd9da",
    pass: "727abbb64ea77f",
  },
});

export const sendPasswordChangeEmail = (userEmail) => {
  console.log("Sending password change email to: ", userEmail);
  const mailOptions = {
    from: "test@mailtrap.io",
    to: userEmail,
    subject: "Password Changed Successfully",
    text: "Your password has been changed successfully. If you did not request this change, please contact support immediately.", // Body of the email
  };

  // Send the email
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Password change email sent: ", info.response);
    }
  });
};
