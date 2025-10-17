import express from "express";
import { profile, attendance,timetable,assingments,notifications,FreesPayment} from "../controllers/studentController.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/profile", auth, profile);
router.get("/attendance", auth, attendance);
router.get("/timetable", auth, timetable);
router.get("/assingments", auth, assingments);
router.get("/notifications", auth, notifications);
router.get("/FreesPayment", auth, FreesPayment);

 


export default router;
