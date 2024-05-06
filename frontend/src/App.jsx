import React, { useEffect } from 'react';
import './App.css'
import Layout from './components/Layout/Layout';

import { useUser } from './utils/UserContext';
import { jwtDecode } from "jwt-decode";


function App() {

  const baseURL = import.meta.env.VITE_BASE_URL;
  const { user, setUser } = useUser();

useEffect(() => {
  const checkLoginStatus = async () => {
    try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      const response = await fetch(`${baseURL}/api/v1/auth/check-login`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          // Include the token in the request headers
          Authorization: `Bearer ${token}`,
        },
      });
      const responseBody = await response.json();
      setUser(response.ok ? { id: decoded.id, ...responseBody.user } : null);
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
    console.log('Updated user:', user);
  }, [user]);

  return (
      <Layout />
);

}

export default App
