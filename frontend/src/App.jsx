import React, { useEffect } from 'react';
import './App.css'
import Layout from './components/Layout/Layout';


import { useUser } from './utils/UserContext';

function App() {

  const baseURL = import.meta.env.VITE_BASE_URL;
  
  const { setUser } = useUser();

useEffect(() => {
  const checkLoginStatus = async () => {
    try {
     const token = localStorage.getItem('accessToken');
      const response = await fetch(`${baseURL}/api/v1/auth/check-login`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          // Include the token in the request headers
          Authorization: `Bearer ${token}`,
        },
      });
      const responseBody = await response.json();

      if (response.ok) {
        setUser(responseBody.user); 
      }

      console.log("successfully verified token");
   } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  checkLoginStatus();
}, [setUser]);

  return (
      <Layout />
);

}

export default App
