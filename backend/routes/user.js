import express from "express";
import {
  getSingleUser,
  getAllUser,
  deleteUser,
  updateUser,
  checkPassword,
  checkPass,
  otpChecking,
  resetpassword,
  uploadAvatar,
  getAvatar,
  getListUser,
  lockUser,
  activeUser,
  inactiveUser,
  createOrUpdateTheme,
  getTheme
} from "../controllers/userController.js";
const router = express.Router();
import { verifyAdmin, verifyUser , verifyStatusChange} from "../utils/verifyToken.js";
import upload from "../utils/Avaupload .js";

// get list users
router.get("/list", verifyAdmin, getListUser);
// update user
router.put("/:id", verifyUser, updateUser);

// delete user
router.delete("/:id", verifyUser, deleteUser);

// get single user
router.get("/:id", getSingleUser);

// get all user
router.get("/", verifyAdmin, getAllUser);

// Check password
router.post("/verify-password", verifyUser, checkPassword);
//Get all user for resting

// Endpoint to initiate the reset password process and send OTP
router.post("/check", checkPass);

// Endpoint to verify OTP
router.post("/otpChecking", otpChecking);

// Endpoint to reset password
router.post("/reset-password", resetpassword);
//Change ava
router.put(
  "/upload-avatar/:userId",
  verifyUser,
  upload.single("avatar"),
  uploadAvatar
);
// get ava
router.get("/avatar/:filename", getAvatar);
// Lock user
router.put("/lock/:id", verifyAdmin, lockUser);
// Unlock user
router.put("/unlock/:id", verifyAdmin, activeUser);
// Active user
router.put("/active/:id", verifyStatusChange, activeUser);
// Inactive user
router.put("/inactive/:id", verifyStatusChange, inactiveUser);
// CreateOrUpdateTheme
router.post('/theme', verifyUser, createOrUpdateTheme);
// getTheme
router.get('/theme/:userId', verifyUser, getTheme);

export default router;
