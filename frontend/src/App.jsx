import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { useUser } from "./utils/UserContext";
import { pushSuccess } from "./components/Toast";
import { useTheme } from "./theme/Theme";
import CookieBanner from "./Pages/Home/components/CookieBanner/index";
import { baseUrl } from "./config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const { theme } = useTheme();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/auth/check-login`, {
          method: "GET",
          credentials: "include",
        });
        const resBody = await response.json();
        if (!resBody.rem && localStorage.getItem("loggedInBefore") === "true") {
          localStorage.removeItem("loggedInBefore");
        }
        setUser(response.ok ? { ...resBody.user } : null);
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [setUser]);

  useEffect(() => {
    const handlePushSuccess = async () => {
      if (user && !localStorage.getItem("loggedInBefore")) {
        if (!isLoading) {
          pushSuccess(`Welcome back, ${user.name}!`);
          localStorage.setItem("loggedInBefore", "true");
        }
      }
    };

    handlePushSuccess();
  }, [user]);

  return (
    <>
      <style>{theme}</style>
      <Layout isLoading={isLoading} />
      <CookieBanner />
    </>
  );
}

export default App;
