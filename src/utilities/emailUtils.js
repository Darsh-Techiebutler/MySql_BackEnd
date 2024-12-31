import nodemailer from "nodemailer";

// Create a Nodemailer transporter using Gmail (with an app password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "darshpatel269@gmail.com", // Your Gmail address
    pass: "gfasqmnroeicynec"
  },
});

export const sendPasswordChangeEmail = (userEmail) => {
  const mailOptions = {
    from: "darshpatel269@gmail.com",
    to: userEmail,
    subject: "Password Changed Successfully",
    text: "Your password has been changed successfully. If you did not request this change, please contact support immediately.", // Body of the email
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Password change email sent: ", info.response);
    }
  });
};
