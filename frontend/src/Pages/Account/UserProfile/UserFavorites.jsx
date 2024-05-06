import React from 'react';
import { useUser } from './Data/UserData.jsx'; 
import { usePosts } from './Data/PostData.jsx';
import { useFavorite } from './Data/PostFavortieData.jsx';
import PostCard from './PostCard.jsx';

function UserFavorites() {
    const { posts } = usePosts();
    const { user } = useUser();
    const { favorites } = useFavorite();  // Assuming favorites is an array

    // Filter posts based on whether their ID is in the user's favorites
    const userPosts = posts.filter(post => 
        favorites.some(fav => fav.Post_id === post.id && fav.userId === user.id && post.Active == true)
    );

    return (
        <div>
            {userPosts.length > 0 ? (
                userPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))
            ) : (
                <p>No favorite posts found.</p>
            )}
        </div>
    );
}

export default UserFavorites;
