// components/Favorites/Favorites.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { useUser } from "../../../utils/UserContext";
import { pushError, pushSuccess } from "../../../components/Toast";
import { baseUrl } from "../../../config";

function Favorites() {
  const [favoritePosts, setFavoritePosts] = useState([]);
  const { user, setUser } = useUser();
  const { id } = useParams();
  const fetchFavoritePostsByUser = async (userId) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/posts/favorites/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        if (userId === id) {
          // Return all posts if it's the user's own favorites
          return result;
        } else {
          // Filter results to include only posts with 'unarchived' status for others
          const filteredPosts = result.filter(
            (post) => post.status === "unarchived"
          );
          return filteredPosts;
        }
      } else {
        throw new Error(result.message || "Failed to fetch favorite posts");
      }
    } catch (error) {
      console.error("Fetch favorite posts error:", error);
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
        // Update logged-in user's likes
        updateUserLikes(favorPostIds);
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
      setError(error.toString());
    }
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
      const url = new URL(`${baseUrl}/api/v1/posts/userunhide/${userId}`);
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
  const updateUserLikes = (likes) => {
    setUser((prev) => ({
      ...prev,
      likes,
    }));
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
  const handleToggleLike = (postId) => {
    toggleLike(postId, user._id, null, null); // Update favorite posts after toggling like
  };
  
  const fetchData = async () => {
    const posts = await fetchFavoritePostsByUser(id);
    setFavoritePosts(posts);
  };

  useEffect(() => {
    fetchData();
  }, [user, id]);

  return (
    <div>
      {favoritePosts.length ? (
        favoritePosts.map((post) => (
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
        <p>No favorite posts available</p>
      )}
    </div>
  );
}

export default Favorites;