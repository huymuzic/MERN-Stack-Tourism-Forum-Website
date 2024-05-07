// components/Favorites/Favorites.js
import React, { useEffect, useState } from "react";
import { usePosts } from "../../../utils/PostsContext";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { useUserInfo } from '../../../utils/UserInforContext';

function Favorites() {
    const { fetchFavoritePostsByUser, toggleLike } = usePosts();
    const [favoritePosts, setFavoritePosts] = useState([]);
    const { info } = useUserInfo(); // Get the current logged-in user's info
    const { id } = useParams();
    const handleToggleLike = (postId) => {
        toggleLike(postId, info._id , null, setFavoritePosts); // Update favorite posts after toggling like
    };

    useEffect(() => {
        const fetchData = async () => {
            const posts = await fetchFavoritePostsByUser(id); // Replace USER_ID with actual user ID
            setFavoritePosts(posts);
        };
        fetchData();
    }, []);

    return (
        <div>
            {favoritePosts.length ? (
                favoritePosts.map((post) => <PostCard key={post._id} post={post} onToggleLike={handleToggleLike} />)
            ) : (
                <p>No favorite posts available</p>
            )}
        </div>
    );
}

export default Favorites;



