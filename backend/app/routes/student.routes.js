import express from "express";
import { profile, attendance } from "../controllers/studentController.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/profile", auth, profile);
router.get("/attendance", auth, attendance);

export default router;
