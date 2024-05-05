import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
    const [user, setUser] = useState({
        _id: '',
        username: '',
        email: '',
        password: '',
        role: '',
        createdAt: '',
        updatedAt: '',
        likes: []
    }); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = import.meta.env.VITE_BASE_URL;  // Make sure this is defined in your .env files

    const fetchUser = async (userId) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');  // Retrieve token inside function
        console.log("🚀 ~ fetchUser ~ token:", token)
        
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
                setUser(jsonResponse.data);  // Update state
            } else {
                throw new Error(jsonResponse.message || 'Failed to fetch user');
            }
                console.log("🚀 ~ fetchUser ~ jsonResponse.data:", jsonResponse.data)
        } catch (error) {
            console.error('Fetch user error:', error);
            setError(error.toString());
        } finally {
            setIsLoading(false);    
        }
    };
    useEffect(() => {
        console.log('Updated user:', user);
    }, [user]);
    
    const updateUser = async (userId, updates) => {
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
            const updatedUser = await response.json();
            if (response.ok) {
                setUser(updatedUser.data);  // Make sure to use .data if that's how your API structures responses
            } else {
                throw new Error(updatedUser.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Update user error:', error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (userId) => {
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
                setUser(null);
            } else {
                const result = await response.json();
                throw new Error(result.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const value = useMemo(() => ({
        user, isLoading, error, fetchUser, updateUser, deleteUser
    }), [user, isLoading, error]);

    return (
        <UserInfoContext.Provider value={value}>
            {children}
        </UserInfoContext.Provider>
    );
};


export const useUserInfo = () => {
    const context = useContext(UserInfoContext);
    if (!context) {
        throw new Error('useUserInfo must be used within a UserInfoProvider');
    }
    return context;
};
