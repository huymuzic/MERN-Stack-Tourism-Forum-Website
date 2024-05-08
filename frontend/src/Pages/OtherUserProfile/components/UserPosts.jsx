// components/UserPosts/UserPosts.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { useUser } from '../../../utils/UserContext';

function UserPosts() {

    const [userPosts, setUserPosts] = useState([]);
    const { user,setUser } = useUser();
    const { id } = useParams();

    
    const baseURL = import.meta.env.VITE_BASE_URL

    const fetchPostsByUser = async (userId) => {

        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/user/${userId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                console.log('User posts fetched:', result);
                const filteredPosts = result.filter((post) => post.parentId === null);
                return filteredPosts;
            } else {
                throw new Error(result.message || 'Failed to fetch user posts');
            }
        } catch (error) {
            console.error('Fetch user posts error:', error);
            return [];
        } 
    };

    const toggleLike = async (postId, userId, setUserPosts = null, setFavoritePosts = null) => {

        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/like/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });
            const result = await response.json();
            if (response.ok) {
                const { post, favoritePosts, userLikes } = result;

                if (setUserPosts) {
                    setUserPosts((prev) =>
                        prev.map((p) => (p._id === postId ? post : p))
                    );
                }

                if (setFavoritePosts) {
                    setFavoritePosts(favoritePosts);
                }

                // Update logged-in user's likes
                updateUserLikes(userLikes);

                console.log('Toggled like:', post, 'Favorite Posts:', favoritePosts);
            } else {
                throw new Error(result.message || 'Failed to toggle like');
            }
        } catch (error) {
            console.error('Toggle like error:', error);
        } 
    };

    const updateUserLikes = (likes) => {
        setUser((prev) => ({
            ...prev,
            likes,
        }));
    };

    const handleToggleLike = (postId) => {
        toggleLike(postId, user._id, setUserPosts); // Update posts after toggling like
    };

    useEffect(() => {
        const fetchData = async () => {
            const posts = await fetchPostsByUser(id); // Replace USER_ID with actual user ID
            setUserPosts(posts);
        };
        fetchData();
    }, []);

    return (
        <div>
            {userPosts.length ? (
                userPosts.map((post) => <PostCard key={post._id} post={post} onToggleLike={handleToggleLike} />)
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
}
export default UserPosts;

