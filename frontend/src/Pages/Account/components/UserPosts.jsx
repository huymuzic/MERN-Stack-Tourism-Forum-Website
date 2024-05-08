// components/UserPosts/UserPosts.js
import React, { useEffect, useState } from "react";

import PostCard from "./PostCard";

function UserPosts() {
    const { fetchPostsByUser, toggleLike } = usePosts();
    const { info } = useUserInfo();
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (info && info._id) {
                const posts = await fetchPostsByUser(info._id);
                setUserPosts(posts);
            }
        };
        fetchData();
    }, [info]);

    const handleToggleLike = (postId) => {
        toggleLike(postId, info._id, setUserPosts);
    };

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

