import express from "express";
import {
  getDoctorDetails,
  saveAppointmentDetails,
} from "../controllers/appoinmentController.js";

const router = express.Router();

router.get("/:id", getDoctorDetails);
router.post("/", saveAppointmentDetails);

export default router;
