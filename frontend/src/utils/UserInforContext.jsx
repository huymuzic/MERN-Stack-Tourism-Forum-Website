import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
    const [info, setInfo] = useState({
        _id: '',
        username: '',
        email: '',
        password: '',
        role: '',
        createdAt: '',
        updatedAt: '',
        avatar: '',
        likes: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = import.meta.env.VITE_BASE_URL;  // Make sure this is defined in your .env files

    const fetchInfo = async (userId) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');  // Retrieve token inside function

        try {
            const response = await fetch(`${baseURL}/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            const jsonResponse = await response.json();
            if (response.ok) {
                setInfo(jsonResponse.data);  // Update state
                console.log("fetch done");
            } else {
                throw new Error(jsonResponse.message || 'Failed to fetch user info');
            }
            console.log("🚀 ~ fetchInfo ~ jsonResponse.data:", jsonResponse.data);
        } catch (error) {
            console.error('Fetch user info error:', error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Updated info:', info);
    }, [info]);

    const updateInfo = async (userId, updates) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');  // Ensure token is refreshed from storage

        try {
            const response = await fetch(`${baseURL}/api/v1/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates)
            });
            const updatedInfo = await response.json();
            if (response.ok) {
                setInfo(updatedInfo.data);  // Make sure to use .data if that's how your API structures responses
            } else {
                throw new Error(updatedInfo.message || 'Failed to update user info');
            }
        } catch (error) {
            console.error('Update user info error:', error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const deleteInfo = async (userId) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${baseURL}/api/v1/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                setInfo(null);
            } else {
                const result = await response.json();
                throw new Error(result.message || 'Failed to delete user info');
            }
        } catch (error) {
            console.error('Delete user info error:', error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };
    const updateUserLikes = (likes) => {
            setInfo((prev) => ({
                ...prev,
                likes,
            }));
        };
    const value = useMemo(() => ({
        info, isLoading, error, fetchInfo, updateInfo, deleteInfo, updateUserLikes
    }), [info, isLoading, error]);

    return (
        <UserInfoContext.Provider value={value}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);
    if (!context) {
        throw new Error("useUserInfo must be used within a UserInfoProvider");
    }
    return context;
};

