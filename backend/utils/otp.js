import nodemailer from 'nodemailer';
import User from '../models/user.js'; // Ensure the path is correct
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();
import { storeOTP } from './otpStorage.js';

export const generateAndStoreOTP = async (email) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(new Date().getTime() + 300000);
        
        // Find the user first
        const user = await User.findOne({ email: email });
        if (!user) {
            console.error("User not found");
            return null; // Or handle this case as needed
        }
        // Store OTP and expiration in localStorage
        storeOTP(email, otp, expires);    
        return otp;
    } catch (error) {
        console.error("Error in generateAndStoreOTP:", error);
        throw error;
    }
};



export async function sendOTPEmail(to, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: { name: "Cosmic Travel", address: process.env.EMAIL_USERNAME },
        to: to,
        subject: "OTP for resetting password",
        html: `<p>Your OTP code is <b>${otp}</b>, please use it to continue.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;  // Re-throw the error for handling it in the calling function
    }
}

export const checkOTPAndUpdatePassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Check if the OTP matches and hasn't expired
        if (user.otp === otp && new Date() <= user.otpExpires) {
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword, otp: null, otpExpires: null } });
            res.json({ success: true, message: "Password updated successfully" });
        } else {
            res.status(401).json({ success: false, message: "Invalid or expired OTP" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
