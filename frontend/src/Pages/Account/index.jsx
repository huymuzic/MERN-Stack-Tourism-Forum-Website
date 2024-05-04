import React, {useState} from 'react';
import './index.css';
import { useUserInfo }  from '../../utils/UserInforContext';
import Profile from './components/Profile';
import UserPosts from './components/UserPosts';
import Themes from './components/Themes';
import Favorites from './components/Favorites';
function UserAccount() {
    const baseURL = import.meta.env.VITE_BASE_URL;
  const { user, fetchUser, updateUser, deleteUser, isLoading, error } = useUserInfo();
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

  const handleVerifyPassword = async () => {
    try {
        const response = await fetch(`${baseURL}/api/v1/users/verify-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ password: inputPassword })
        });
        const data = await response.json();
        if (response.ok) {
            setAnnounceConfirm(true);
            updateUser({ active: !user.active });
            setConfirmActive(false);
        } else {
            throw new Error(data.message || 'Incorrect password, please try again.');
        }
    } catch (error) {
        alert(error.message);
        setInputPassword('');
    }
};
  const handleCancel = () => {
      setInputPassword('');
      setConfirmActive(false);
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        try {
            const response = await fetch(`${baseURL}/api/v1/users/${user._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
            alert(error.message);
        }
    }
};

  const ActiveComponent = NAV_ITEMS[activeNav];
  const date = new Date(user.createdAt);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  return (
      <>
          <div className="container mt-5">
              <div className="row">
                  <div className="col-md-4 text-center">
                      <img src={user.Ava} alt="User Avatar" className="img-thumbnail rounded-circle mb-3" />
                  </div>
                  <div className="col-md-8">
                      <h1>{user.username}</h1>
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
                              <p className="card-text">Joined: {formattedDate}</p>
                              <p className="card-text">Role: {user.role}</p>
                              <button 
                                  className={`btn ${user.active ? 'btn-danger' : 'btn-success'}`}
                                  onClick={() => setConfirmActive(true)}
                              >
                                  {user.active ? 'Deactivate Account' : 'Activate Account'}
                              </button>
                             
                              {!user.active && (
                                <button className="btn btn-danger" onClick={handleDeleteUser}>Delete Account</button>
                            )}
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

export default UserAccount;
