import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});



const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL, // sender
      to: to,                  // receiver
      subject: "Reset your password",
      html: `<h2>Your OTP code is: <b>${otp}</b>It expires in 5 minutes</h2>`
    });
    console.log("Email sent successfully ✅");
  } catch (err) {
    console.error("Error sending email ❌", err);
  }
};
export default sendMail;
