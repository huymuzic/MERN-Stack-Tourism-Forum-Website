import express from "express";
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

const router = express.Router();

router.post("/create", createTour);

router.put("/:id", updateTour);

router.delete("/:id", deleteTour);

router.get("/:id", getSingleTour);

// router.get("/", getAllTour);
router.get("/", getListTour);
router.get("/search/getTourBySearch", getTourBySearch);
router.get("/search/getFeaturedTours", getFeaturedTour);
router.get("/search/getTourCount", getTourCount);
router.get("/search/getTopDestinations", getTopDestinations);
router.post("/destination", createDestination);

export default router;
