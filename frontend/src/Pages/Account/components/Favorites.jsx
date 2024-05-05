import React, { useEffect, useState } from "react";
import { usePosts } from "../../../utils/PostsContext";
import { useUserInfo } from "../../../utils/UserInforContext";
import PostCard from "./PostCard";

function Favorites() {
    const { fetchFavoritePostsByUser } = usePosts();
    const { user } = useUserInfo();
    const [favoritePosts, setFavoritePosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user && user._id) {
                const posts = await fetchFavoritePostsByUser(user._id);
                setFavoritePosts(posts);
            }
        };
        fetchData();
    }, [user]);

    return (
        <div>
            {favoritePosts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    );
}
export default Favorites;