import React, { useState } from 'react';
import { useUser } from './Data/UserData';   
import './CSS/UserProfile.css'
import UserInfo from './UserInfor';
import UserPosts from './UserPosts';
import UserThemes from './UserThemes';
import UserFavorites from './UserFavorites';

function UserProfile() {
    const { user, updateUser } = useUser();  
    const [activeNav, setActiveNav] = useState('Profile');
    const [confirmActive, setConfirmActive] = useState(false);
    const [inputPassword, setInputPassword] = useState('');
    const [announceConfirm, setAnnounceConfirm] = useState(false);
    const NAV_ITEMS = {
        Profile: Profile,
        Posts: UserPosts,
        Themes: Themes,
        Favorites: Favorites,
    };

    const handleNavClick = (e, item) => {
        e.preventDefault(); 
        setActiveNav(item);
    };

    const handleVerifyPassword = () => {
        if (inputPassword === user.password) {
            setAnnounceConfirm(true);
            updateUser({ active: !user.active });
            setConfirmActive(false);
        } else {
            alert('Incorrect password, please try again.');
            setInputPassword('');
        }
    };

    const handleCancel = () => {
        setInputPassword('');
        setConfirmActive(false);
    };

    const ActiveComponent = NAV_ITEMS[activeNav];

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <img src={user.Ava} alt="User Avatar" className="img-thumbnail rounded-circle mb-3" />
                    </div>
                    <div className="col-md-8">
                        <h1>{user.name}</h1>
                        <p>{user.email}</p>
                        <div className="mb-3">
                            <span className="badge bg-primary">Posts: {user.Posts}</span>
                            <span className="badge bg-success ms-2">Favorites: {user.Favorites}</span>
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
                                <p className="card-text">Joined: {user.Joined}</p>
                                <p className="card-text">Role: {user.Job}</p>
                                <button 
                                    className={`btn ${user.active ? 'btn-danger' : 'btn-success'}`}
                                    onClick={() => setConfirmActive(true)}
                                >
                                    {!user.active ? 'Deactivate Account' : 'Activate Account'}
                                </button>
                                {user.Role === "Admin" && <button className="btn btn-warning ms-2">Delete User</button>}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 mt-3">
                        {user.active ? 
                            <p>Your Account is inactive right now! Please reactivate it for any action.</p> :
                            <ActiveComponent />
                        }
                    </div>
                </div>

                {confirmActive && (
                    <div className="modal show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Please Provide Your Password</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCancel}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Enter current password" 
                                        value={inputPassword} 
                                        onChange={e => setInputPassword(e.target.value)}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleVerifyPassword}>Submit</button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
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
                        <h3>Your account is {user.active ? "inactive" : "active"}!</h3>
                        <button onClick={() => setAnnounceConfirm(false)} className="btn btn-success">Confirm</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default UserProfile;



