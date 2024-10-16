import { createContext, useState, useContext } from "react";
import { ThemeProvider } from "../theme/Theme";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetchedUser, setIsFetchedUser] = useState(false);

  return (
    <UserContext.Provider
      value={{ user, setUser, isFetchedUser, setIsFetchedUser }}
    >
      <ThemeProvider userId={user?._id}>{children}</ThemeProvider>
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
