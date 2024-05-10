// otpStorage.js

// Define an object to store OTP and its expiration
const otpStorage = {};

// Function to store OTP for a given email
export function storeOTP(email, otp, expires) {
    otpStorage[email] = { otp, expires };
}

// Function to retrieve stored OTP for a given email
export function getStoredOTP(email) {
    return otpStorage[email];
}

// Function to clear stored OTP for a given email
export function clearOTP(email) {
    delete otpStorage[email];
}


