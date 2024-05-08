import React, { useEffect, useState } from 'react';
import './App.css'
import Layout from './components/Layout/Layout';
import { useUser } from './utils/UserContext';
import { useUserInfo } from './utils/UserInforContext'
import { pushSuccess } from './components/Toast';
import { set } from 'mongoose';

const baseURL = import.meta.env.VITE_BASE_URL;

function App() {

  const { user,setUser } = useUser();
  const { info, fetchInfo, updateInfo, deleteInfo, isLoading, error } = useUserInfo();
useEffect(() => {
  const checkLoginStatus = async () => {
    try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const response = await fetch(`${baseURL}/api/v1/auth/check-login`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          // Include the token in the request headers
          Authorization: `Bearer ${token}`,
        },
      });
      const responseBody = await response.json();
      setUser(response.ok ? { ...responseBody.user } : null);   
      fetchInfo(responseBody.user._id);
    } else {
      setUser(null);
    }
  } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  checkLoginStatus();
}, [setUser]);

  useEffect(() => {
    const handlePushSuccess = async () => {
      if (user) {
        await new Promise(resolve => setTimeout(resolve, 0));
        pushSuccess(`Welcome back, ${user.name}!`);
      }
    };

    handlePushSuccess();
  }, [user]);


  return (
      <Layout />
);

}

export default App
