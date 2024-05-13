// components/UserPosts/UserPosts.js
import { useEffect, useState } from "react";
import { useUser } from "../../../utils/UserContext";
import PostCard from "./PostCard";

function UserPosts() {
    const { user,setUser } = useUser();
    const [userPosts, setUserPosts] = useState([]);

    const baseURL = import.meta.env.VITE_BASE_URL

    const fetchPostsByUser = async (userId) => {

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/user/${userId}`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',},
            });
            const result = await response.json();
            if (response.ok) {
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

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/like/${postId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',},
                body: JSON.stringify({ userId })
            });
            const result = await response.json();
            if (response.ok) {
                const { post, favoritePosts, favorPostIds } = result;

                if (setUserPosts) {
                    setUserPosts((prev) =>
                        prev.map((p) => (p._id === postId ? post : p))
                    );
                }

                if (setFavoritePosts) {
                    setFavoritePosts(favoritePosts);
                }

                // Update logged-in user's likes
                updateUserLikes(favorPostIds);

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

    const fetchData = async () => {
        if (user && user._id) {
            const posts = await fetchPostsByUser(user._id);
            setUserPosts(posts);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);
    
    const handleToggleLike = (postId) => {
        toggleLike(postId, user._id, setUserPosts);
    };

    return (
        <div style={{ marginLeft: '10px', marginTop: "-20px" }}>
            {userPosts.length ? (
                userPosts.map((post) => <PostCard key={post._id} post={post} onToggleLike={handleToggleLike} />)
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
}

export default UserPosts;



