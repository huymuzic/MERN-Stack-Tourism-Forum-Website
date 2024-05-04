import React from 'react';

import './NotiCard.css'; 

const NotificationCard = ({ show, message, type, onClose }) => {
    if (!show) {
        return null;
    }

    const iconClass = `notification-icon ${type}`;
    const buttonClass = `notification-button ${type}`;

    // Determine the icon based on the type
    const icon = type === 'success' ? '✓' : '✕'; // ✓ for success, ✕ for danger

    return (
        <div className="notification-card">
            <div className={iconClass}>{icon}</div> {/* Display appropriate icon */}
            <div>{message}</div>
            <button className={buttonClass} onClick={onClose}>Confirm</button>
        </div>
    );
};

export default NotificationCard;
