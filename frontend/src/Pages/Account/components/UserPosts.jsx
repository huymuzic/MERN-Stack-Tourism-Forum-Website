import React, { useEffect, useState } from "react";
import { usePosts } from "../../../utils/PostsContext";
import { useUserInfo } from "../../../utils/UserInforContext";
import PostCard from "./PostCard";

function UserPosts() {
    const { fetchPostsByUser, posts } = usePosts();
    const { user } = useUserInfo();
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user && user._id) {
                const fetchedPosts = await fetchPostsByUser(user._id);
                setUserPosts(fetchedPosts);
            }
        };
        fetchData();
    }, [user]);

    return (
        <div>
            {userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    );
}

export default UserPosts;
