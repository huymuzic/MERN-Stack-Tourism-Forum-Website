import React, { createContext, useContext, useState } from 'react';

const initialUser = {
    id: 1,
    name: "Truc",
    email: "s3974820@rmit.edu.vn",
    password: "123456Truc",
    Posts: 2,
    Favorites: 100,
    Joined: "22/11/2004",
    Job: "Wibu Lord",
    Role: "Admin",
    Active: true,
    Ava: "https://yt3.googleusercontent.com/wzEypbVsmY9BI-IbLwVius4UvC2rejtJB_PTXAdPpYXQ07EIjl5Ms55NCFq_dILwONpxrzE2xA=s900-c-k-c0x00ffffff-no-rj"
};

const UserContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(initialUser);

    const updateUser = (updates) => {
        setUser(current => ({ ...current, ...updates }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
