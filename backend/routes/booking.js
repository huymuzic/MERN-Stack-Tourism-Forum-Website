import express from "express";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import {
  createBooking,
  getBookingByUserId,
  getAllBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", verifyUser, createBooking);
router.get("/:userId", verifyUser, getBookingByUserId);
router.get("/", verifyAdmin, getAllBookings);

export default router;
