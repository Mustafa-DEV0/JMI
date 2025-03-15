import express from "express";
import {
  getDoctorDashboard,
  postDoctorProfile,
  getDoctors,
} from "../controllers/doctorController.js";


const router = express.Router();

router.get("/dashboard/:id", getDoctorDashboard);
router.post("/details/:id", postDoctorProfile);
router.get("/list", getDoctors);

export default router;
