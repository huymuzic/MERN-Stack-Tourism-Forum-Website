// components/Favorites/Favorites.js
import { useEffect, useState } from "react";
import { useUser} from "../../../utils/UserContext";
import PostCard from "./PostCard";

function Favorites() {

    const { user,setUser } = useUser();
    const [favoritePosts, setFavoritePosts] = useState([]);

    const baseURL = import.meta.env.VITE_BASE_URL

    const fetchFavoritePostsByUser = async (userId) => {

        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${baseURL}/api/v1/posts/favorites/${userId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                return result;
            } else {
                throw new Error(result.message || 'Failed to fetch favorite posts');
            }
        } catch (error) {
            console.error('Fetch favorite posts error:', error);
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
            setError(error.toString());
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
            const posts = await fetchFavoritePostsByUser(user._id);
            setFavoritePosts(posts);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);


    const handleToggleLike = (postId) => {
        toggleLike(postId, user._id, null, setFavoritePosts);
    };

    return (
        <div style={{ marginLeft: '10px', marginTop: "-20px" }}>
            {favoritePosts.length ? (
                favoritePosts.map((post) => <PostCard key={post._id} post={post} onToggleLike={handleToggleLike} />)
            ) : (
                <p>No favorite posts available</p>
            )}
        </div>
    );
}

export default Favorites;






