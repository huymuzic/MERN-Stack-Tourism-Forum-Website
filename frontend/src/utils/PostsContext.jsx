import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useUserInfo } from "./UserInforContext";
const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const { info, updateUserLikes } = useUserInfo();
    const { user } = useUserInfo();


    useEffect(() => {
        if (user && user._id) {
            fetchPostsByUser(user._id);
        } else {
            fetchAllPosts();
        }
    }, [user]);

    const fetchAllPosts = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                setPosts(result);
                console.log("All posts fetched:", result);
            } else {
                throw new Error(result.message || "Failed to fetch posts");
            }
        } catch (error) {
            console.error("Fetch posts error:", error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPostsByUser = async (userId) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                console.log("User posts fetched:", result);
                const filteredPosts = result.filter((post) => post.parentId === null);
                setPosts(filteredPosts);
                return filteredPosts;
            } else {
                throw new Error(result.message || "Failed to fetch user posts");
            }
        } catch (error) {
            console.error("Fetch user posts error:", error);
            setError(error.toString());
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFavoritePostsByUser = async (userId) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/favorites/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                console.log("Favorite posts fetched:", result);
                return result;
            } else {
                throw new Error(result.message || "Failed to fetch favorite posts");
            }
        } catch (error) {
            console.error("Fetch favorite posts error:", error);
            setError(error.toString());
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const createPost = async (userId, postData) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/user/${userId}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });
            const result = await response.json();
            if (response.ok) {
                setPosts((prev) => [result, ...prev]);
                console.log("Created post:", result);
            } else {
                throw new Error(result.message || "Failed to create post");
            }
        } catch (error) {
            console.error("Create post error:", error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const updatePost = async (postId, updatedData) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/edit/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            const result = await response.json();
            if (response.ok) {
                setPosts((prev) => prev.map((post) => (post._id === postId ? result : post)));
                console.log("Updated post:", result);
            } else {
                throw new Error(result.message || "Failed to update post");
            }
        } catch (error) {
            console.error("Update post error:", error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const deletePost = async (postId) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/delete/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setPosts((prev) => prev.filter((post) => post._id !== postId));
                console.log("Deleted post:", postId);
            } else {
                const result = await response.json();
                throw new Error(result.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Delete post error:", error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

const toggleLike = async (postId, userId, setUserPosts = null, setFavoritePosts = null,updateUserLikes) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`${baseURL}/api/v1/posts/like/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
        });
        const result = await response.json();
        if (response.ok) {
            const { post, favoritePosts,userLikes } = result;    
            setPosts((prev) =>
                prev.map((p) => (p._id === postId ? post : p))
            );

            if (setUserPosts) {
                setUserPosts((prev) =>
                    prev.map((p) => (p._id === postId ? post : p))
                );
            }
            if (setFavoritePosts) {
                setFavoritePosts(favoritePosts);
            }
            updateUserLikes(userLikes);

            console.log("Toggled like:", post, "Favorite Posts:", favoritePosts);
        } else {
            throw new Error(result.message || "Failed to toggle like");
        }
    } catch (error) {
        console.error("Toggle like error:", error);
        setError(error.toString());
    } finally {
        setIsLoading(false);
    }
};
    const value = useMemo(
        () => ({
            posts,
            isLoading,
            error,
            fetchAllPosts,
            fetchPostsByUser,
            fetchFavoritePostsByUser,
            createPost,
            updatePost,
            deletePost,
            toggleLike,
        }),
        [posts, isLoading, error]
    );

    return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};

export const usePosts = () => {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error("usePosts must be used within a PostsProvider");
    }
    return context;
};

