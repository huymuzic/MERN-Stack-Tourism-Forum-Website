import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-login", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User is logged in",
    user: req.user,
    rem: req.rememberMe,
  });
});
router.get("/logout", logout);

export default router;
