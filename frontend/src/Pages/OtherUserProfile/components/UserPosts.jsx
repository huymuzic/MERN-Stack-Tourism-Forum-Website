// components/UserPosts/UserPosts.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { useUser } from "../../../utils/UserContext";
import { pushError, pushSuccess } from "../../../components/Toast";

function UserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const { user, setUser } = useUser();
  const { id } = useParams();


  const baseURL = import.meta.env.VITE_BASE_URL;

  const fetchPostsByUser = async (userId) => {


    try {
      const response = await fetch(`${baseURL}/api/v1/posts/user/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        const filteredPosts = result.filter((post) => post.parentId === null);
        return filteredPosts;
      } else {
        throw new Error(result.message || "Failed to fetch user posts");
      }
    } catch (error) {
      console.error("Fetch user posts error:", error);
      return [];
    }
  };

  const toggleLike = async (
    postId,
    userId,
    setUserPosts = null,
    setFavoritePosts = null
  ) => {

    try {
      const response = await fetch(`${baseURL}/api/v1/posts/like/${postId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      if (response.ok) {
        const { post, favoritePosts, favorPostIds } = result;

        if (setUserPosts) {
          setUserPosts((prev) =>
            prev.map((p) => (p._id === postId ? post : p))
          );
        }

        if (setFavoritePosts) {
          setFavoritePosts(favoritePosts);
        }

        // Update logged-in user's likes
        updateUserLikes(favorPostIds);
        console.log(favorPostIds);
        console.log(postId);
        if (favorPostIds.indexOf(postId) != -1) {
          pushSuccess("You successfully like this post!");
        } else {
          pushError("You successfully unlike this post!");
        }
      } else {
        throw new Error(result.message || "Failed to toggle like");
      }
    } catch (error) {
      console.error("Toggle like error:", error);
    }
  };

  const updateUserLikes = (likes) => {
    setUser((prev) => ({
      ...prev,
      likes,
    }));
  };

  const handleToggleLike = (postId) => {
    toggleLike(postId, user._id, setUserPosts); // Update posts after toggling like
  };
  const handleLockConfirm = async (userId) => {
    try {
      const url = new URL(`${baseURL}/api/v1/posts/userhide/${userId}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushError("Hide post successfully");
        fetchData();
      } else {
        pushError("Failed to hide post");
        throw new Error("Failed to lock user");
      }
    } catch (error) {}
  };

  const handleUnLockConfirm = async (userId) => {
    try {
      console.log("work nì");
      const url = new URL(`${baseURL}/api/v1/posts/userunhide/${userId}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Unhide post successfully");
        fetchData();
      } else {
        pushError("Failed to unhide post");
        throw new Error("Failed to unlock user");
      }
    } catch (error) {}
  };
  const fetchData = async () => {
    const posts = await fetchPostsByUser(id); // Replace USER_ID with actual user ID
    setUserPosts(posts);
  };
  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div>
      {userPosts.length ? (
        userPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onToggleLike={handleToggleLike}
            handleLockConfirm={(id) => handleLockConfirm(id)}
            handleUnLockConfirm={(id) => handleUnLockConfirm(id)}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}
export default UserPosts;
