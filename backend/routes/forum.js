import express from "express";
import mongoose from "mongoose";

import { verifyToken } from "../utils/verifyToken.js";

import { posts } from "../controllers/forum/postsController.js";
import { details } from "../controllers/forum/postDetails.js";
import { create } from "../controllers/forum/createPost.js";
import { like, reply } from "../controllers/forum/interactPost.js";
import { searchFilter } from "../controllers/forum/searchFilter.js";

import { postGfs } from '../utils/gridfsconfig.js';

const router = express.Router();

router.get("/", posts);
router.get("/p/:id", details);
router.get("/search", searchFilter);
router.get('/images/:id', async (req, res) => {
    try {
        const readStream = postGfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
        readStream.pipe(res);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }  
});

router.post("/", verifyToken, create);
router.post("/p/:id/like", verifyToken, like);
router.post("/p/:id/reply", verifyToken, reply);

export default router;
