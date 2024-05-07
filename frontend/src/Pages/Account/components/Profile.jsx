// Profile.js
import React, { useState, useEffect } from 'react';
import { useUserInfo } from '../../../utils/UserInforContext';
import { getAvatarUrl } from '../../../utils/getAvar.js';

const Profile = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { info, fetchInfo, updateInfo, isLoading, error } = useUserInfo();
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [inputPassword, setInputPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [announceConfirm, setAnnounceConfirm] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(getAvatarUrl(info.avatar, baseURL));
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSpecialChars: false,
  });

  useEffect(() => {
    if (info) {
      setNewName(info.name);
      setNewEmail(info.email);
      setNewPassword(info.password); // Be cautious with managing passwords like this
      setTempAvatar(getAvatarUrl(info.avatar, baseURL));
    }
  }, [info]);

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
    updatePasswordCriteria(newPasswordValue);
  };

  function updatePasswordCriteria(password) {
    setPasswordCriteria({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#\$%\^&\*]/.test(password),
    });
  }

  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValid(isValid);
    return isValid;
  };

  const handleVerifyPassword = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/users/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ password: inputPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsVerifying(false);
        setIsChanging(true);
      } else {
        throw new Error(data.message || 'Incorrect password, please try again.');
      }
    } catch (error) {
      alert(error.message);
      setInputPassword('');
    }
  };

  const handleSubmitChanges = async () => {
    if (!validateEmail(newEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!newPassword || Object.values(passwordCriteria).includes(false)) {
      alert('Please ensure the new password meets all criteria.');
      return;
    }
    try {
      const response = await fetch(`${baseURL}/api/v1/users/${info._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ userId: info._id, username: newName, email: newEmail, password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnnounceConfirm(true);
        setIsChanging(false);
        fetchInfo(info._id); // Refresh user data
      } else {
        throw new Error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (loadEvent) => setTempAvatar(loadEvent.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdate = async () => {
    const formData = new FormData();
    formData.append('avatar', selectedAvatarFile);

    try {
      const response = await fetch(`${baseURL}/api/v1/users/upload-avatar/${info._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        fetchInfo(info._id); // Refresh user data
        setAvatarModal(false);
        alert('Avatar updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update avatar.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='container mt-4'>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className='row'>
        <div className='col-md-8'>
          <h2 className='mb-3'>My Profile</h2>
          <div className='card'>
            <div className='card-body d-flex'>
              <div className='profile-details flex-grow-1'>
                {isChanging ? (
                  <>
                    <div className='mb-3'>
                      <label className='form-label'>Name</label>
                      <input
                        type='text'
                        className='form-control'
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Email</label>
                      <input
                        type='email'
                        className='form-control'
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                      {!emailValid && <div className='text-danger'>Invalid email format</div>}
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>New Password (if changing)</label>
                      <input
                        type='password'
                        className='form-control'
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                      />
                      <ul>
                        {Object.entries(passwordCriteria).map(([key, met]) => (
                          <li key={key} style={{ color: met ? 'green' : 'red' }}>
                            {met ? '✓' : '✗'} {key}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className='btn btn-primary' onClick={handleSubmitChanges}>
                      Submit Changes
                    </button>
                    <button className='btn btn-secondary' onClick={() => setIsChanging(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>Name: {info.name}</p>
                    <p>Email: {info.email}</p>
                    <p>Password: *********</p>
                    <button className='btn btn-info' onClick={() => setIsVerifying(true)}>
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
              <div className='ms-3'>
                <img
                  src={tempAvatar}
                  alt='User Avatar'
                  className='rounded-circle'
                  style={{ width: '100px', height: '100px' }}
                  onClick={() => setAvatarModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {avatarModal && (
        <div className='modal show' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Update Your Avatar</h5>
                <button type='button' className='close' onClick={() => setAvatarModal(false)}>
                  &times;
                </button>
              </div>
              <div className='modal-body'>
                <img src={tempAvatar} alt='Preview Avatar' className='img-thumbnail mb-3' />
                <input type='file' className='form-control' onChange={handleAvatarChange} />
                <input
                  type='text'
                  className='form-control mt-2'
                  placeholder='Or enter image URL'
                  onChange={(e) => setTempAvatar(e.target.value)}
                />
              </div>
              <div className='modal-footer'>
                <button className='btn btn-success' onClick={handleAvatarUpdate}>
                  Confirm
                </button>
                <button className='btn btn-secondary' onClick={() => setAvatarModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isVerifying && (
        <div
          className='modal show'
          tabIndex='-1'
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Verify Your Password</h5>
                <button type='button' className='btn-close' onClick={() => setIsVerifying(false)}></button>
              </div>
              <div className='modal-body'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Enter current password'
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                />
              </div>
              <div className='modal-footer'>
                <button className='btn btn-success' onClick={handleVerifyPassword}>
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {announceConfirm && (
        <div
          className='alert alert-success position-fixed top-50 start-50 translate-middle'
          style={{ zIndex: 1050 }}
        >
          <strong>Success!</strong> Your profile has been updated.
          <button type='button' className='btn-close' onClick={() => setAnnounceConfirm(false)}></button>
        </div>
      )}
    </div>
  );
};

export default Profile;
