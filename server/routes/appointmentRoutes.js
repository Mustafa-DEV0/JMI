import express from "express";
import {
  getDoctorDetails,
  saveAppointmentDetails,
  getPatientHistory,
} from "../controllers/appoinmentController.js";

const router = express.Router();

router.get("/get/:id", getDoctorDetails);
router.post("/save", saveAppointmentDetails);
router.get("/history", getPatientHistory);

export default router;
