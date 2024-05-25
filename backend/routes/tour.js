import express from "express";
import mongoose from "mongoose";

import {
  createDestination,
  createTour,
  updateTour,
  deleteTour,
  getSingleTour,
  getTourBySearch,
  getFeaturedTour,
  getTourCount,
  getTopDestinations,
  getListTour,
} from "../controllers/tourController.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { postGfs } from "../utils/gridfsconfig.js";
const router = express.Router();
import { uploadAndResizeMiddleware } from "../utils/uploadAndResize.js";
// Configure multer for file uploads
router.post("/", verifyAdmin, uploadAndResizeMiddleware, createTour);
router.put("/:id", verifyAdmin, uploadAndResizeMiddleware, updateTour);

router.delete("/:id", verifyAdmin, deleteTour);

router.get("/:id", getSingleTour);
router.get("/images/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const readStream = postGfs.openDownloadStream(
      new mongoose.Types.ObjectId(req.params.id)
    );
    readStream.pipe(res);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// router.get("/", getAllTour);
router.get("/", getListTour);
router.get("/search/getTourBySearch", getTourBySearch);
router.get("/search/getFeaturedTours", getFeaturedTour);
router.get("/search/getTourCount", getTourCount);
router.get("/search/getTopDestinations", getTopDestinations);
router.post("/destination", createDestination);

export default router;
