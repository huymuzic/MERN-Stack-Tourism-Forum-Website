import express from "express";
import { createImages, getAllImages } from "../controllers/imagesController.js";

const router = express.Router();

router.post("/", createImages);
router.get("/", getAllImages);

export default router;
