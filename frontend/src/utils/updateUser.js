import { baseUrl } from "../config";

export const checkLoginStatus = async (setUser) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/auth/check-login`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const resBody = await response.json();
    setUser(response.ok ? { ...resBody.user } : null);
  } catch (error) {
    console.error("Error checking login status:", error);
    setUser(null);
  }
};
