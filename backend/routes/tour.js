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
  getListTour
} from "../controllers/tourController.js";
import { postGfs } from '../utils/gridfsconfig.js';
const router = express.Router();

// Configure multer for file uploads
router.post("/", createTour);

router.put('/:id', updateTour);

router.delete("/:id", deleteTour);

router.get("/:id", getSingleTour);
router.get('/images/:id', async (req, res) => {
  console.log(req.params.id)
  try {
      const readStream = postGfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
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
