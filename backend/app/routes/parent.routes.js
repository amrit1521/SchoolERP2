import express from "express";
import { dashboard,profile,timetable,assingments,attendance} from "../controllers/parentController.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/dashboard", auth, dashboard);
router.get("/profile", auth, profile);
router.get("/attendance", auth, attendance);
router.get("/timetable", auth, timetable);
router.get("/assingments", auth, assingments);
// router.get("/notifications", auth, notifications);
// router.get("/FreesPayment", auth, FreesPayment);

 


export default router;