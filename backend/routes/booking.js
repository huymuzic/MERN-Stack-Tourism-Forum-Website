import express from "express";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import {
  createBooking,
  getBookings,
  getAllBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", verifyUser, createBooking);
router.get("/:id", verifyUser, getBookings);
router.get("/", verifyAdmin, getAllBookings);

export default router;
