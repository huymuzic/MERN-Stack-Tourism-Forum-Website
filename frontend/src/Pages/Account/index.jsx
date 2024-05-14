// UserAccount.js
import { useState, useEffect } from 'react';
import './index.css';
import { useUser } from '../../utils/UserContext';
import Profile from './components/Profile';
import UserPosts from './components/UserPosts';
import Themes from './components/Themes';
import Favorites from './components/Favorites';
import { getAvatarUrl } from '../../utils/getAvar.js';


function UserAccount() {
  const { user,setUser } = useUser();
  const [activeNav, setActiveNav] = useState('Profile');
  const [confirmActive, setConfirmActive] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [loading, setLoading] = useState(true); 
  const [announceConfirm, setAnnounceConfirm] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const NAV_ITEMS = {
    Profile: Profile,
    Posts: UserPosts,
    Themes: Themes,
    Favorites: Favorites,
  };
  const [showActions, setShowActions] = useState(false);

  const toggleActions = () => setShowActions(!showActions); 

 useEffect(() => {
    if (!user) {
      // Simulate fetching user data
      setLoading(true);
      // Assume fetchUser() is a function that fetches user data
      // fetchUser().then(userData => {
      //   setUser(userData);
      //   setLoading(false);
      // });
    } else {
      setLoading(false);
    }
  }, [user, setUser]);
  useEffect(() => {
    setInputPassword('');
    setAnnounceConfirm(false);
    setConfirmActive(false);
  }, [user]);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setActiveNav(item);
  };

  const updateInfo = async (userId, updates) => {
    const token = localStorage.getItem('accessToken');  // Ensure token is refreshed from storage

    try {
        const response = await fetch(`${baseURL}/api/v1/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updates)
        });
        const updatedInfo = await response.json();
        if (response.ok) {
          setUser(updatedInfo.data);  // Make sure to use .data if that's how your API structures responses
        } else {
            throw new Error(updatedInfo.message || 'Failed to update user info');
        }
    } catch (error) {
        console.error('Update user info error:', error);
    } 
};

  const handleVerifyPassword = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/users/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ password: inputPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setAnnounceConfirm(true);
        const updatedStatus = user.status === 'active' ? 'inactive' : 'active';
        await updateInfo(user._id, { status: updatedStatus });
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

  const handleDeleteInfo = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`${baseURL}/api/v1/users/${user._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
  const date = new Date(user?.createdAt);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const avatarUrl = getAvatarUrl(user?.avatar, baseURL);
  if (loading) {
    return <div>Loading...</div>;  // Display a loading message or spinner
  }
  return (
<>
  <div className="container mt-4" style={{ maxWidth: '1200px' }}>
    {/* Profile Header */}
    <div className="row justify-content-center mb-3">
    <div className="col-md-10">
      <div
        className="card"
        style={{
          padding: '15px',
          border: '2px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="row align-items-start">
          <div className="col-auto">
            <img
              src={avatarUrl}
              alt="User Avatar"
              style={{
                border: '3px solid #ccc',
                borderRadius: '50%',
                width: '150px',
                height: '150px',
              }}
            />
          </div>
          <div className="col">
            <h2 style={{ fontWeight: 'bold', fontSize: '2rem' }}>
              {user?.name} {user?.role === 'admin' && (
                <i className="fa-sharp fa-solid fa-shield-halved"></i>
              )}
            </h2>
            <p style={{ fontSize: '1.25rem' }}>@{user?.username}</p>
            <div className="mb-3 d-flex">
              <span
                className="badge bg-primary me-2"
                style={{ fontSize: '1.25rem', padding: '10px' }}
              >
                Posts: {user?.posts ? user.posts.length : 0}
              </span>
              <span
                className="badge bg-success"
                style={{ fontSize: '1.25rem', padding: '10px' }}
              >
                Favorites: {user?.likes ? user.likes.length : 0}
              </span>
            </div>
          </div>
          <div className="col-auto">
              <div className="dropdown">
                <button
                  className="btn btn-light"
                  onClick={toggleActions}
                  style={{ fontSize: "1.5rem", backgroundColor: "white", border: "none" }}
                >
                  . . .
                </button>
                {showActions && (
                  <ul
                    className="dropdown-menu show"
                    style={{ display: "block", backgroundColor: "white",position: "absolute", right: 0 }}
                  >
                    <li>
                      <button
                        className={`dropdown-item btn ${
                          user.status === "active" ? "btn-danger" : "btn-success"
                        }`}
                        style={{ fontSize: "0.9rem", padding: "6px" }}
                        onClick={() =>  setConfirmActive(true)}
                      >
                        {user.status === "active" ? "Inactivate Account" : "Activate Account"}
                      </button>
                    </li>
                    {user.status === "active" && (
                      <li>
                        <button
                          className="dropdown-item btn btn-danger"
                          style={{ fontSize: "0.9rem", padding: "6px" }}
                          onClick={handleDeleteInfo}
                        >
                          Delete Account
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
        </div>
       {/* Navigation tabs under the profile header */}
          <ul className="nav nav-tabs mt-2">
            {Object.keys(NAV_ITEMS).map((item) => (
              <li key={item} className="nav-item">
                <a
                  className={`nav-link ${activeNav === item ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => handleNavClick(e, item)}
                  style={{ fontSize: '1.2rem', padding: '10px 15px' }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Info and My Profile Components */}
    <div className="row justify-content-center">
      <div className="col-md-10" style={{ display: 'flex'}}>
        {/* Info Component */}
        <div className="col-md-3" style={{ marginRight: '10px' }}>
          <div className="card mb-3">
            <div className="card-body text-start">
              <h5
                className="card-title"
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.4rem',
                  position: 'relative',
                }}
              >
                Info:
              </h5>
              <div className="d-flex flex-column align-items-start">
                <p className="mb-1" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Joined:</p>
                <p className="mb-2" style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>{formattedDate}</p>
                <p className="mb-1" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Role:</p>
                <p className="mb-1" style={{ fontSize: '1.1rem' }}>{user?.role == 'admin'&&<i className="fa-sharp fa-solid fa-shield-halved"></i>} {user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ActiveComponent or Profile Component */}
        <div className="col-md-7" style={{ marginLeft: '10px', marginTop: "0px" }}>
          {user.status === 'active' ? (
            <ActiveComponent />
          ) : (
            <div className="card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Account Inactive</h5>
                <img
                  src="https://img.icons8.com/ios-filled/100/000000/robot-2.png"
                  alt="Robot Icon"
                  style={{ width: '80px', marginBottom: '10px' }}
                />
                <p>Your Account is inactive right now! Please reactivate it for any action.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Modal for Password Confirmation */}
    {confirmActive && (
      <div className="modal show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Please Provide Your Password</h5>
            </div>
            <div class="modal-body">
              <input
                type="password"
                class="form-control"
                placeholder="Enter current password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" onClick={handleVerifyPassword}>Submit</button>
              <button type="button" class="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Notification Card */}
    {announceConfirm && (
      <div className="notification-card">
        <div className="checkmark-container">
          <i className="fas fa-check"></i>
        </div>
        <h3>Your account is {user.active ? 'active' : 'inactive'}!</h3>
        <button onClick={() => setAnnounceConfirm(false)} class="btn btn-success">Confirm</button>
      </div>
    )}
  </div>
</>

  );
}

export default UserAccount;
