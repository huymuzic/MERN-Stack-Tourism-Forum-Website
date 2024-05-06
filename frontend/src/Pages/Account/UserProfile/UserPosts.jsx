import React from 'react';
import { usePosts } from './Data/PostData';
import PostCard from './PostCard';
import { useUser } from './Data/UserData';

function UserPosts() {
    const { posts, setPosts } = usePosts();  // Assuming usePosts returns setPosts for updating the state
    const { user } = useUser();

    const deletePost = postId => {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);  // Update the local state or make an API call to delete from the backend
    };

    const userPosts = posts.filter(post => post.userId === user.id);

    return (
        <div>
            {userPosts.map((post) => (
                <PostCard key={post.id} post={post} deletePost={deletePost} />
            ))}
        </div>
    );
}

export default UserPosts;
