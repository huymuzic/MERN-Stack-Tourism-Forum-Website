// components/UserPosts/UserPosts.js
import React, { useEffect, useState } from "react";
import { usePosts } from "../../../utils/PostsContext";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { useUserInfo } from '../../../utils/UserInforContext';
function UserPosts() {
    const { fetchPostsByUser, toggleLike } = usePosts();
    const [userPosts, setUserPosts] = useState([]);
    const { info } = useUserInfo(); // Get the current logged-in user's info
    const { id } = useParams();
    const handleToggleLike = (postId) => {
        toggleLike(postId, info._id, setUserPosts); // Update posts after toggling like
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

