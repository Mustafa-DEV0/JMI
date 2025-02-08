import express from "express";
import {
  getDoctorDetails,
  saveAppointmentDetails,
} from "../controllers/appoinmentController.js";

const router = express.Router();

router.get("/appointment/:id", getDoctorDetails);
router.post("/appointment", saveAppointmentDetails);

export default router;
