import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { useUser } from "../../../utils/UserContext";
import { pushError, pushSuccess } from "../../../components/Toast";
import { baseUrl } from "../../../config";

function UserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const { user, setUser } = useUser();
  const { id } = useParams();

  const fetchPostsByUser = async (userId) => {
 

    try {
      const response = await fetch(`${baseUrl}/api/v1/posts/user/${userId}`, {
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
      const response = await fetch(`${baseUrl}/api/v1/posts/like/${postId}`, {
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
        updateUserLikes(favorPostIds);
        if (favorPostIds.indexOf(postId) != -1) {
          pushSuccess("Post liked");
        } else {
          pushSuccess("Post unliked");
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
    toggleLike(postId, user._id, setUserPosts);
  };
  const handleLockConfirm = async (userId) => {
    try {
      const url = new URL(`${baseUrl}/api/v1/posts/userhide/${userId}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Archive post successfully");
        fetchData();
      } else {
        pushError("Failed to archive post");
        throw new Error("Failed to archive post");
      }
    } catch (error) {}
  };

  const handleUnLockConfirm = async (userId) => {
    try {
      const url = new URL(`${baseUrl}/api/v1/posts/userunhide/${userId}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Unarchive post successfully");
        fetchData();
      } else {
        pushError("Failed to unarchive post");
        throw new Error("Failed to unarchive post");
      }
    } catch (error) {}
  };
  const handleDelete = async (postId) => {
    try {
        const response = await fetch(`${baseUrl}/api/forum/p/${postId}/deletePost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        const responseBody = await response.json();
        fetchData();
        pushSuccess('Deleted post');
    } catch (error) {
        console.error(error);
    }
};
  const fetchData = async () => {
    const posts = await fetchPostsByUser(id);
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
            handleDelete={(id) => handleDelete(id)}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}
export default UserPosts;