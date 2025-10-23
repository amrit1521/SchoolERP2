import express from "express";
import {notifications} from "../controllers/globalController.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/notifications", auth, notifications);

export default router;
