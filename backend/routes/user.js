import express from "express";
import {
  getSingleUser,
  getAllUser,
  deleteUser,
  updateUser,
  getListUser,
  lockUser,
  unlockUser,
} from "../controllers/userController.js";

const router = express.Router();

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";


// get list users
router.get("/list", getListUser);
// update user
router.put("/:id", verifyUser, updateUser);

// delete user
router.delete("/:id", verifyUser, deleteUser);

// get single user
router.get("/:id", verifyUser, getSingleUser);

// get all user
router.get("/", verifyAdmin, getAllUser);

// Lock user
router.put("/lock/:id", lockUser);

// Unlock user
router.put("/unlock/:id", unlockUser);

export default router;
