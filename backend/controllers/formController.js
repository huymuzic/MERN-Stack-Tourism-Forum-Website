import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const sendContactForm = async (req, res) => {
  const { fullName, email, phoneNumber, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: { name: "Cosmic Travel", address: process.env.CONTACT_EMAIL },
    to: "cosmictravel123@gmail.com",
    subject: "Contact Form Submit Data",
    text: `
        Full Name: ${fullName}
        Email: ${email}
        Phone Number: ${phoneNumber}
        Message: ${message}
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
