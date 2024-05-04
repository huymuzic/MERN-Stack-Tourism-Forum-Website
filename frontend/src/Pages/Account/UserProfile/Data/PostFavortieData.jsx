import React, { createContext, useContext, useState } from 'react';

const initialFavorites = [
    { "Post_id": 1, "userId": 2 },
    { "Post_id": 3, "userId": 1 },
    { "Post_id": 5, "userId": 1 },
    { "Post_id": 6, "userId": 4 },
    { "Post_id": 2, "userId": 1 },
    { "Post_id": 4, "userId": 3 }
];

const FavoriteContext = createContext();
export const useFavorite = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(initialFavorites);

    const addFavorite = (post) => {
        setFavorites(currentFavorites => [...currentFavorites, post]);
    };

    const removeFavorite = (postId) => {
        setFavorites(currentFavorites => currentFavorites.filter(favorite => favorite.Post_id !== postId));
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};
