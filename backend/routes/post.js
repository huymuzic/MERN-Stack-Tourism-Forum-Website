import express from "express";
import {
    getAllPosts,
    getPostsByUser,
    createPost,
    updatePost,
    deletePost,
    toggleLikePost,
    getFavoritePostsByUser
} from "../controllers/postController.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Fetch all posts
router.get("/all", verifyUser, getAllPosts);

// Fetch posts by a specific user
router.get("/user/:userId", verifyUser, getPostsByUser);

// Fetch favorite posts by a specific user
router.get("/favorites/:userId", verifyUser, getFavoritePostsByUser);

// Create a new post
router.post("/user/:userId/create", verifyUser, createPost);

// Update a post
router.put("/edit/:postId", verifyUser, updatePost);

// Delete a post
router.delete("/delete/:postId", verifyUser, deletePost);

// Toggle like/favorite on a post
router.put("/like/:postId", verifyUser, toggleLikePost);

export default router;
