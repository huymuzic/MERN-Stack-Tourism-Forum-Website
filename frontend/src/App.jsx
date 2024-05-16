import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { useUser } from "./utils/UserContext";
import { pushSuccess } from "./components/Toast";
import { useTheme } from "./theme/Theme";

const baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  const { theme } = useTheme();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v1/auth/check-login`, {
          method: "GET",
          credentials: "include",
        });
        const resBody = await response.json();
        if (!resBody.rem && localStorage.getItem("loggedInBefore") === "true") {
          localStorage.removeItem("loggedInBefore");
        }
        setUser(response.ok ? { ...resBody.user } : null);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, [setUser]);

  useEffect(() => {
    const handlePushSuccess = async () => {
      if (user && !localStorage.getItem("loggedInBefore")) {
        setTimeout(() => {
          pushSuccess(`Welcome back, ${user.name}!`);
          localStorage.setItem("loggedInBefore", "true");
        }, 2000);
      }
    };

    handlePushSuccess();
  }, [user]);

  return (
    <>
      <style>{theme}</style>
      <Layout isLoading={isLoading} />
    </>
  );
}

export default App;
