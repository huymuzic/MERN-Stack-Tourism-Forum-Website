import express from "express";

import { verifyToken } from "../utils/verifyToken.js";

import { posts } from "../controllers/forum/postsController.js";
import { details } from "../controllers/forum/postDetails.js";
import { category } from "../controllers/forum/categoryList.js";
import { create } from "../controllers/forum/createPost.js";
import { like, reply } from "../controllers/forum/interactPost.js";

const router = express.Router();

router.get("/", posts);
router.get("/p/:id", details);
router.get("/c/:category", category);

router.post("/", verifyToken, create);
router.post("/p/:id/like", verifyToken, like);
router.post("/p/:id/reply", verifyToken, reply);

export default router;
