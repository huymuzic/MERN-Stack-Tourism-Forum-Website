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
  getAllTour,
  getListTour,
  unhideTour,
  hideTour,
} from "../controllers/tourController.js";
import {
  verifyAdmin,
  verifyUser,
  verifyStatusChange,
} from "../utils/verifyToken.js";
import { tourPostGfs } from "../utils/gridfsconfig.js";
const router = express.Router();
import { uploadAndResizeMiddleware } from "../utils/uploadAndResize.js";
// Configure multer for file uploads
router.post("/", verifyAdmin, uploadAndResizeMiddleware, createTour);
router.put("/:id", verifyAdmin, uploadAndResizeMiddleware, updateTour);

router.delete("/:id", verifyAdmin, deleteTour);

router.get("/:id", getSingleTour);
router.get("/images/:id", async (req, res) => {
  try {
    const readStream = tourPostGfs.openDownloadStream(
      new mongoose.Types.ObjectId(req.params.id)
    );
    readStream.pipe(res);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// router.get("/", getAllTour);
router.get("/search/admin", verifyAdmin, getListTour);
router.get("/", getAllTour);
router.get("/search/getTourBySearch", getTourBySearch);
router.get("/search/getFeaturedTours", getFeaturedTour);
router.get("/search/getTourCount", getTourCount);
router.get("/search/getTopDestinations", getTopDestinations);
router.post("/destination", createDestination);
router.put("/unhide/:id", verifyAdmin, unhideTour);
router.put("/hide/:id", verifyAdmin, hideTour);
export default router;
