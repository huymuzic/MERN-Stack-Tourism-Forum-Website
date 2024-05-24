import express from "express";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import {
  createBooking,
  getBookingByUserId,
  getAllBookings,
  getAllBookingByUserId,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", verifyUser, createBooking);
router.get("/user/:userId/bookings", verifyUser, getAllBookingByUserId);
router.get("/:userId", verifyUser, getBookingByUserId);
router.get("/", verifyAdmin, getAllBookings);

export default router;
