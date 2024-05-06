// components/Favorites/Favorites.js
import React, { useEffect, useState } from "react";
import { usePosts } from "../../../utils/PostsContext";
import { useUserInfo } from "../../../utils/UserInforContext";
import PostCard from "./PostCard";

function Favorites() {
    const { fetchFavoritePostsByUser, toggleLike } = usePosts();
    const { info } = useUserInfo();
    const [favoritePosts, setFavoritePosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (info && info._id) {
                const posts = await fetchFavoritePostsByUser(info._id);
                setFavoritePosts(posts);
                console.log("User Favorited Posts:", posts);
            }
        };
        fetchData();
    }, [info]);

    const handleToggleLike = (postId) => {
        toggleLike(postId, info._id,null, setFavoritePosts);
    };

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



