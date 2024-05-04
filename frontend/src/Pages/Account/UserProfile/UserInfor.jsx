import React, { useState } from 'react';
import { useUser } from './Data/UserData';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { usePosts } from './Data/PostData';
function UserInfo() {
    const [inputPassword, setInputPassword] = useState('');
    const { user, updateUser } = useUser();
    const { posts, updatePost } = usePosts();
    const [newName, setNewName] = useState(user.name);
    const [newEmail, setNewEmail] = useState(user.email);
    const [newPassword, setNewPassword] = useState(user.password);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const [AnnounceConfirm, setAnnounceConfirm] = useState(false);
    const [avatarModal, setAvatarModal] = useState(false);
    const [tempAvatar, setTempAvatar] = useState(user.avatar);
    const [passisChange,ChangePass] = useState(false);
    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSpecialChars: false
    });
    const handleNewPasswordChange = (e) => {
        const newPasswordValue = e.target.value;
        ChangePass(true);
                setNewPassword(newPasswordValue);
        updatePasswordCriteria(newPasswordValue);
    };
    function updatePasswordCriteria(password) {
        setPasswordCriteria({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChars: /[!@#\$%\^&\*]/.test(password)
        });
    }

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleVerifyPassword = () => {
        if (inputPassword === user.password) {
            setIsVerifying(false);
            setIsChanging(true);
        } else {
            alert('Incorrect password, please try again.');
            setInputPassword('');
        }
    };

    const handleSubmitChanges = () => {
        if (!emailValid) {
            alert('Please enter a valid email address.');
            return;
        }
        posts.forEach(post => {
            if (post.userName === user.name) {
              updatePost(post.id, { userName: newName });
            }
          });
        updateUser({
            name: newName,
            email: newEmail,
            password: newPassword,
        });
        setAnnounceConfirm(true);
        setIsChanging(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => setTempAvatar(loadEvent.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUrlChange = (url) => {
        setTempAvatar(url);
    };

    const openAvatarModal = () => {
        setAvatarModal(true);
    };

    const closeAvatarModal = () => {
        setAvatarModal(false);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <h2 className="mb-3">My Profile</h2>
                    <div className="card">
                        <div className="card-body d-flex">
                            <div className="profile-details flex-grow-1">
                                {isChanging ? (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input type="text" className="form-control" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                            {!validateEmail(newEmail) && <div className="text-danger">Invalid email format</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="text" className="form-control" value={newPassword} onChange={(e) => handleNewPasswordChange(e)} />
                                            {passisChange && ( <div className='checkingPass'>
                                                                    <ul>
                                                                        {Object.entries(passwordCriteria).map(([key, met]) => (
                                                                            <li key={key} style={{ color: met ? 'green' : 'red' }}>
                                                                                {met ? '✓' : '✗'} {key}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div> ) }
                                        </div>
                                        <button className="btn btn-primary" onClick={handleSubmitChanges}>Submit Changes</button>
                                        <button className="btn btn-secondary" onClick={() => setIsChanging(false)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <p>Name: {user.name}</p>
                                        <p>Email: {user.email}</p>
                                        <p>Password: *********</p>
                                        <button className="btn btn-info" onClick={() => setIsVerifying(true)}>Edit Profile</button>
                                    </>
                                )}
                            </div>
                            <div className="ms-3">
                                <img src={tempAvatar || user.Ava} alt="User Avatar" className="rounded-circle" style={{ width: '100px', height: '100px' }} onClick={openAvatarModal} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {avatarModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Your Avatar</h5>
                                <button type="button" className="close" onClick={closeAvatarModal}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <img src={tempAvatar} alt="Preview Avatar" className="img-thumbnail mb-3" />
                                <input type="file" className="form-control" onChange={handleAvatarChange} />
                                <input type="text" className="form-control mt-2" placeholder="Or enter image URL" onChange={(e) => handleAvatarUrlChange(e.target.value)} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={() => { updateUser({ Ava: tempAvatar }); closeAvatarModal(); }}>Confirm</button>
                                <button className="btn btn-secondary" onClick={closeAvatarModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
             {isVerifying && (
                <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Verify Your Password</h5>
                                <button type="button" className="btn-close" onClick={() => setIsVerifying(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="password" className="form-control" placeholder="Enter current password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={handleVerifyPassword}>Verify</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {AnnounceConfirm && (
                <div className="alert alert-success position-fixed top-50 start-50 translate-middle" style={{ zIndex: 1050 }}>
                    <strong>Success!</strong> Your profile has been updated.
                    <button type="button" className="btn-close" onClick={() => setAnnounceConfirm(false)}></button>
                </div>
            )}
        </div>
    );
}

export default UserInfo;





