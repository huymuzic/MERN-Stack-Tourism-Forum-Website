// Profile.js
import { useState, useEffect } from 'react';
import { getAvatarUrl } from '../../../utils/getAvar.js';
import { useUser } from "../../../utils/UserContext";

const Profile = () => {

  const baseURL = import.meta.env.VITE_BASE_URL;
  const { user,setUser } = useUser(); 
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

  const [tempAvatar, setTempAvatar] = useState(getAvatarUrl(user.avatar, baseURL));
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSpecialChars: false,
  });

  
  const fetchInfo = async (userId) => {
    const token = localStorage.getItem('accessToken');  // Retrieve token inside function
    try {
        const response = await fetch(`${baseURL}/api/v1/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        const jsonResponse = await response.json();
        if (response.ok) {
          setUser(jsonResponse.data);  
        } else {
            throw new Error(jsonResponse.message || 'Failed to fetch user info');
        }
    } catch (error) {
        console.error('Fetch user info error:', error);
    }
};
useEffect(() => {
}, [user]);
  useEffect(() => {
    if (user) {
      setNewName(user.name);
      setNewEmail(user.email);
      setNewPassword(user.password); // Be cautious with managing passwords like this
      setTempAvatar(getAvatarUrl(user.avatar, baseURL));
    }
  }, [user]);

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
      const response = await fetch(`${baseURL}/api/v1/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ userId: user._id, name: newName, email: newEmail, password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnnounceConfirm(true);
        setIsChanging(false);
        fetchInfo(user._id);
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
      const response = await fetch(`${baseURL}/api/v1/users/upload-avatar/${user._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        fetchInfo(user._id); // Refresh user data
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
    <div className='container mt-0'>
    <div className='row justify-content-center'>
        <div className='card' style={{ width: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div className='card-body d-flex align-items-center'>
            <div className='profile-details flex-grow-1'>
            <h2 className='mb-3'>My Profile</h2>
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
                  <button className='btn btn-primary me-2' onClick={handleSubmitChanges}>
                    Submit Changes
                  </button>
                  <button className='btn btn-secondary' onClick={() => setIsChanging(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Password: *********</p>
                  <button className='btn btn-info me-2' onClick={() => setIsVerifying(true)}>
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
                style={{ width: '150px', height: '150px', cursor: 'pointer' }}
                onClick={() => setAvatarModal(true)}
              />
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
        className='alert alert-success position-fixed  bottom-0 end-0 translate-middle' style={{ zIndex: 9999 }}
      >
        <strong>Success!</strong> Your profile has been updated.
        <button type='button' className='btn-close' onClick={() => setAnnounceConfirm(false)}></button>
      </div>
    )}
  </div>
);
};

export default Profile;
