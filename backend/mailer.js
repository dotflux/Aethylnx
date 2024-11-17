import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  host:'smtp.gmail.com',
  port:587,
  secure:false,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;