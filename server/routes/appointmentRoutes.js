import express from "express";
import {
  getDoctorDetails,
  saveAppointmentDetails,
  getPatientHistory,
  updateAppointmentStatus,
} from "../controllers/appoinmentController.js";

const router = express.Router();

router.get("/get/:id", getDoctorDetails);
router.post("/save", saveAppointmentDetails);
router.get("/history", getPatientHistory);
router.put("/update/:id", updateAppointmentStatus);


export default router;
