import express from "express";
import {
  getSingleUser,
  getAllUser,
  deleteUser,
  updateUser,
  checkPassword,
} from "../controllers/userController.js";

const router = express.Router();

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

// update user
router.put("/:id", verifyUser, updateUser);

// delete user
router.delete("/:id", verifyUser, deleteUser);

// get single user
router.get("/:id", verifyUser, getSingleUser);

// get all user
router.get("/", verifyAdmin, getAllUser);

// Check password
router.post("/verify-password", verifyUser, checkPassword);

export default router;
