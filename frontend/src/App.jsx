import { useEffect, useState } from 'react';
import './App.css'
import Layout from './components/Layout/Layout';
import { useUser } from './utils/UserContext';
import { pushSuccess } from './components/Toast';
import { useTheme } from './theme/Theme';

const baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  const { theme } = useTheme()
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(true);

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
          console.log(responseBody);
          setUser(response.ok ? { ...responseBody.user } : null);  
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, [setUser]);

  useEffect(() => {
    const handlePushSuccess = async () => {
      if (user && isFirstLogin) {
        await new Promise(resolve => setTimeout(resolve, 0));
        pushSuccess(`Welcome back, ${user.name}!`);
        setIsFirstLogin(false); 
      }
    };

    handlePushSuccess();
  }, [user, isFirstLogin]);

  return (
    <>
      <style>
        {theme}
      </style>
      <Layout isLoading={isLoading} />
    </>
  );

}

export default App;
