import React, { createContext, useContext, useState } from 'react';

// Initially loaded posts data
const initialPosts = [
    {   "id":1,
        "userId":1,
        "userName": "Truc",
        "postDate": "20/03/2021",
        "content": "Lorem ipsum or whatever people use for placeholder here",
        "image": "https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "favorites": 150,
        "Active":true,
        "comments": 75
    },
    {   "id":2,
        "userId":2,
        "userName": "User 2",
        "postDate": "22/03/2021",
        "content": "Another interesting post content here",
        "image": "https://images.unsplash.com/photo-1646668072507-b2215b873c70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Active":true,
        "favorites": 200,
        "comments": 50
    },
    {    "id":3,
        "userId":3,
        "userName": "Author 3",
        "postDate": "25/03/2021",
        "content": "A fascinating fact about a landmark",
        "image": "https://images.unsplash.com/photo-1713552027772-f2f71887c9b3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Active":true,
        "favorites": 300,
        "comments": 120
    },
    {   "id":4,
        "userId":1,
        "userName": "Truc",
        "postDate": "28/03/2021",
        "content": "Sharing my thoughts on a recent event",
        "image": "https://images.unsplash.com/photo-1546156751-a5bcca6b999c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Active":true,
        "favorites": 250,
        "comments": 80
    },
    {   "id":5,
        "userId":5,
        "userName": "Member 5",
        "postDate": "30/03/2021",
        "content": "Look at this beautiful sunset!",
        "image": "https://images.unsplash.com/photo-1540202403-b7abd6747a18?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Active":true,
        "favorites": 500,
        "comments": 200
    },
    {   "id":6,
        "userId":1,
        "userName": "Truc",
        "postDate": "02/04/2021",
        "content": "Exploring the wonders of the ocean",
        "image": "https://images.unsplash.com/photo-1714027103665-2080d81fdb9d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Active":true,
        "favorites": 450,
        "comments": 220
    }
];

const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState(initialPosts);

    const updatePost = (postId, updates) => {
        setPosts(currentPosts => currentPosts.map(post => {
            if (post.id === postId) { 
                return { ...post, ...updates }; 
            }
            return post;
        }));
    };

    const deletePost = (postId) => {
        setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    };

    const hidePost = (postId) => {
        setPosts(currentPosts => currentPosts.map(post => {
            if (post.id === postId) {
                return { ...post, Active: !post.Active };
            }
            return post;
        }));
    };

    return (
        <PostsContext.Provider value={{ posts, updatePost, deletePost, hidePost }}>
            {children}
        </PostsContext.Provider>
    );
};