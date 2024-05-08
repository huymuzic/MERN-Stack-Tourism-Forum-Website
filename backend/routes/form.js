import express from "express";
import { sendContactForm } from "../controllers/formController.js";

const router = express.Router();

router.post("/contact", sendContactForm);

export default router;
