import React, { useState } from 'react';
import NotificationCard from './NotificationCard';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [message, setMessage] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [userData, setUserData] = useState(null);
    const baseURL = import.meta.env.VITE_BASE_URL;

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
    };

    const handleEmailSubmit = async () => {
        // API call to backend to send OTP
        const response = await fetch(`${baseURL}/api/v1/users/check`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ identifier: email })
        });
        const check = await response.json();
        const data = check.data;
        if (check.success) {
            setUserData(data); 
            console.log(data);
            setCurrentStep(2);
            showNotification('Your email is found successfully. We will send OTP to your registered email.', 'success');
        } else {
            setMessage(check.message);
            showNotification(check.message, 'danger');
        }
    };

    const handleVerifyOTP = async () => {
        // API call to backend to verify OTP
        const response = await fetch(`${baseURL}/api/v1/users/otpChecking`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (data.success) {
            setCurrentStep(3);
            setMessage('OTP verified successfully.');
            showNotification('OTP verified successfully.', 'success');
        } else {
            setMessage(data.message);
            showNotification(data.message, 'danger');
        }
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            showNotification('Passwords do not match.', 'danger');
            return;
        }
        // API call to reset the password
        const response = await fetch(`${baseURL}/api/v1/users/reset-password`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, newPassword })
        });
        const data = await response.json();
        if (data.success) {
            setCurrentStep(4);
            setMessage('Password reset successfully.');
            showNotification('Password reset successfully.', 'success');
        } else {
            setMessage(data.message);
            showNotification(data.message, 'danger');
        }
    };

    const closeNotification = () => {
        setNotification({ show: false, message: '', type: '' });
    };

    return (
        <div className="container mt-5">
            {message && <p>{message}</p>}

            <NotificationCard show={notification.show} message={notification.message} type={notification.type} onClose={closeNotification} />

            {currentStep === 1 && (
                <div>
                    <h2>Reset Password</h2>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <button onClick={handleEmailSubmit}>Send OTP</button>
                </div>
            )}

            {currentStep === 2 && (
                <div>
                    <h2>Confirm Account</h2>
                    {userData && (
                        <div>
                            <p>This is your account:</p>
                            <img src={userData.avatar} alt="Avatar" style={{ width: '50px', borderRadius: '50%' }} />
                            <p>Name: {userData.username}</p>
                        </div>
                    )}
                    <p>We will send the OTP to your registered email. Please confirm.</p>
                    <button onClick={() => setCurrentStep(3)}>Confirm</button>
                </div>
            )}

            {currentStep === 3 && (
                <div>
                    <h2>Enter OTP</h2>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                    />
                    <button onClick={handleVerifyOTP}>Verify OTP</button>
                </div>
            )}

            {currentStep === 4 && (
                <div>
                    <h2>Set New Password</h2>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                    />
                    <button onClick={handlePasswordReset}>Reset Password</button>
                </div>
            )}

            {currentStep === 5 && (
                <div>
                    <h2>Password Reset Successfully</h2>
                    <p>Your password has been updated. You can now use your new password to log in.</p>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;

