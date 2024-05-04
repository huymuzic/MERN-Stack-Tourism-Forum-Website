import React, { useState } from 'react';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [message, setMessage] = useState('');
    const baseURL = import.meta.env.VITE_BASE_URL;
    const handleEmailSubmit = async () => {
        // API call to backend to send OTP
        const response = await fetch(`${baseURL}/api/user/check`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({identifier: email})
        });
        const data = await response.json();
        if (data.success) {
            setCurrentStep(2);
            setMessage("OTP sent to your email.");
        } else {
            setMessage(data.message);
        }
    };

    const handleVerifyOTP = async () => {
        // API call to backend to verify OTP
        const response = await fetch(`${baseURL}//api/verify-otp`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, otp})
        });
        const data = await response.json();
        if (data.success) {
            setCurrentStep(3);
            setMessage("OTP verified successfully.");
        } else {
            setMessage(data.message);
        }
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        // API call to reset the password
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, newPassword})
        });
        const data = await response.json();
        if (data.success) {
            setCurrentStep(4);
            setMessage("Password reset successfully.");
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div className="container mt-5">
            {message && <p>{message}</p>}

            {currentStep === 1 && (
                <div>
                    <h2>Reset Password</h2>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                    <button onClick={handleEmailSubmit}>Send OTP</button>
                </div>
            )}

            {currentStep === 2 && (
                <div>
                    <h2>Enter OTP</h2>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                    <button onClick={handleVerifyOTP}>Verify OTP</button>
                </div>
            )}

            {currentStep === 3 && (
                <div>
                    <h2>Set New Password</h2>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" />
                    <button onClick={handlePasswordReset}>Reset Password</button>
                </div>
            )}

            {currentStep === 4 && (
                <div>
                    <h2>Password Reset Successfully</h2>
                    <p>Your password has been updated. You can now use your new password to log in.</p>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;

