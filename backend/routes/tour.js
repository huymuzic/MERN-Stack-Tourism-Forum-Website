import express from "express";
import mongoose from "mongoose";

import {
  createDestination,
  createTour,
  updateTour,
  deleteTour,
  getAllTour,
  getSingleTour,
  getTourBySearch,
  getFeaturedTour,
  getTourCount,
  getTopDestinations,
  getListTour,
   unhideTour, 
   hideTour
} from "../controllers/tourController.js";
import { verifyAdmin, verifyUser , verifyStatusChange} from "../utils/verifyToken.js";
import { postGfs } from '../utils/gridfsconfig.js';
const router = express.Router();

// Configure multer for file uploads
router.post("/", verifyAdmin, createTour);

router.put('/:id', verifyAdmin, updateTour);

router.delete("/:id", verifyAdmin, deleteTour);

router.get("/:id", getSingleTour);
router.get('/images/:id', async (req, res) => {
  try {
      const readStream = postGfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
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
