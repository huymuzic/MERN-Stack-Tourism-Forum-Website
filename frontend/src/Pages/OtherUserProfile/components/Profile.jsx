import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAvatarUrl } from '../../../utils/getAvar.js';
const Profile = () => {

  const baseURL = import.meta.env.VITE_BASE_URL;
  const { id } = useParams();
  const [otherUserInfo, setOtherUserInfo] = useState({});

  const fetchOtherUserInfo = async (userId) => {
    try {
        const response = await fetch(`${baseURL}/api/v1/users/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
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
const avatarUrl = getAvatarUrl(otherUserInfo.avatar, baseURL);
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-3">{otherUserInfo.name} Profile</h2>
          <div className="card">
            <div className="card-body d-flex">
              <div className="profile-details flex-grow-1">
                    <p>Name: {otherUserInfo.name}</p>
                    <p>Email: {otherUserInfo.email}</p>
              </div>
              <div className="ms-3">
                <img src={avatarUrl} alt="User Avatar" className="rounded-circle" style={{ width: "100px", height: "100px" }}  />
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
  );
};

export default Profile;

