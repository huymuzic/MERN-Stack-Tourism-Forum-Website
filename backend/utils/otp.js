const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.js'); // Adjust path as necessary


app.post('/api/user/check', async (req, res) => {
    const { identifier } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });
        if (user) {
            res.json({ success: true, user: { email: user.email, name: user.username, id: user._id, Ava: user.avatar } });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
// Generates a 6-digit secure OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

// Sends an OTP email to a user
async function sendOTPEmail(to) {
    const otp = generateOTP();
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
        from: { name: "Your Service Name", address: process.env.EMAIL_USERNAME },
        to: to,
        subject: "OTP for resetting password",
        html: `<p>Your OTP code is <b>${otp}</b>, please use it to continue.</p>`
    };

    try {
        // Save or update the user's OTP in the database
        const expires = new Date(new Date().getTime() + 300000); // OTP expires in 5 minutes
        await User.findOneAndUpdate({ email: to }, { $set: { otp: otp, otpExpires: expires }}, { upsert: true });

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email', error: error.message };
    }
}

// Verifies the OTP provided by the user
async function verifyOTP(email, otp) {
    try {
        const user = await User.findOne({ email: email });
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            return { success: false, message: "Invalid or expired OTP." };
        }
        return { success: true, message: "OTP verified successfully." };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: "Server error.", error: error.message };
    }
}

module.exports = {
    sendOTPEmail,
    verifyOTP,
};
