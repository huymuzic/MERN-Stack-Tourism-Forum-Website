// OtherUserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useUserInfo } from '../../utils/UserInforContext';
import { useParams } from 'react-router-dom';
import Profile from './components/Profile';
import UserPosts from './components/UserPosts';
import Favorites from './components/Favorites';

const OtherUserProfile = () => {
    const { info: loggedInInfo } = useUserInfo();
    const { id } = useParams(); // Get the ":id" from the URL
    const [otherUserInfo, setOtherUserInfo] = useState({});
    const [activeNav, setActiveNav] = useState('Profile');
    const [confirmActive, setConfirmActive] = useState(false);
    const [announceConfirm, setAnnounceConfirm] = useState(false);
    const baseURL = import.meta.env.VITE_BASE_URL 
    const NAV_ITEMS = {
        Profile: Profile,
        Posts: UserPosts,
        Favorites: Favorites,
    };

    const handleNavClick = (e, item) => {
        e.preventDefault();
        setActiveNav(item);
    };

    const fetchOtherUserInfo = async (userId) => {
        try {
            const response = await fetch(`${baseURL}/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setOtherUserInfo(data.data); // Adjust this according to your response structure
            } else {
                throw new Error(data.message || 'Failed to fetch user info');
            }
        } catch (error) {
            console.error('Fetch user info error:', error);
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchOtherUserInfo(id); // Fetch user data based on the URL parameter
    }, [id]);

    const handleToggleStatus = async () => {
        const newStatus = otherUserInfo.status === 'active' ? 'inactive' : 'active';
        try {
            const response = await fetch(`${baseURL}/api/v1/users/${otherUserInfo._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (response.ok) {
                setOtherUserInfo({ ...otherUserInfo, status: newStatus });
                setAnnounceConfirm(true);
            } else {
                throw new Error(data.message || 'Failed to update user status');
            }
        } catch (error) {
            console.error('Update status error:', error);
            alert(error.message);
        } finally {
            setConfirmActive(false);
        }
    };

    const handleDeleteInfo = async () => {
        if (window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
            try {
                const response = await fetch(`${baseURL}/api/v1/users/${otherUserInfo._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Account successfully deleted.');
                    // Implement any additional cleanup or redirection logic here
                } else {
                    throw new Error(data.message || 'Failed to delete account.');
                }
            } catch (error) {
                console.error('Delete user info error:', error);
                alert(error.message);
            }
        }
    };

    const ActiveComponent = NAV_ITEMS[activeNav];
    const date = new Date(otherUserInfo.createdAt);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    console.log(otherUserInfo)
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4 text-center">
                    <img src={otherUserInfo.avatar} alt="User Avatar" className="img-thumbnail rounded-circle mb-3" />
                </div>
                <div className="col-md-8">
                    <h1>{otherUserInfo.name}</h1>
                    <p>@{otherUserInfo.username}</p>
                    <div className="mb-3">
                        <span className="badge bg-primary">Posts&Comments: {otherUserInfo.posts ? otherUserInfo.posts.length : 0}</span>
                        <span className="badge bg-success ms-2">Favorites: {otherUserInfo.likes ? otherUserInfo.likes.length : 0}</span>
                    </div>
                    <div className="nav nav-tabs">
                        {Object.keys(NAV_ITEMS).map(item => (
                            <a
                                key={item}
                                className={`nav-item nav-link ${activeNav === item ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => handleNavClick(e, item)}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row mt-3 align-items-start">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Info</h5>
                            <p className="card-text">Joined: {formattedDate}</p>
                            <p className="card-text">Role: {otherUserInfo.role}</p>
                            {(loggedInInfo.role === 'admin' || loggedInInfo._id === otherUserInfo._id) && (
                                <>
                                    <button
                                        className={`btn ${otherUserInfo.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                                        onClick={() => setConfirmActive(true)}
                                    >
                                        {otherUserInfo.status === 'active' ? 'Inactivate Account' : 'Activate Account'}
                                    </button>

                                    {otherUserInfo.status === 'active' && (
                                        <button className="btn btn-danger ms-2" onClick={handleDeleteInfo}>Delete Account</button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mt-3">
                    {otherUserInfo.status === 'active' ?
                        <ActiveComponent /> :
                        <p>The account is inactive right now! Please reactivate it to perform any action.</p>
                    }
                </div>
            </div>

            {confirmActive && (
                <div className="modal show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Status Change</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setConfirmActive(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleToggleStatus}>Confirm</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirmActive(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {announceConfirm && (
                <div className="notification-card">
                    <div className="checkmark-container">
                        <i className="fas fa-check"></i>
                    </div>
                    <h3>The account is now {otherUserInfo.status === 'active' ? 'active' : 'inactive'}!</h3>
                    <button onClick={() => setAnnounceConfirm(false)} className="btn btn-success">Confirm</button>
                </div>
            )}
        </div>
    );
};

export default OtherUserProfile;
