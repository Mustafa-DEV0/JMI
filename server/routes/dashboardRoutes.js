import express from "express";
import { 
  getDoctorDashboardData, 
  updateAppointmentStatus,
  createPrescription,
  getDoctorAppointments  // Newly added controller function
} from "../controllers/doctordashboardController.js";

const router = express.Router();

router.get("/doctor/:id", getDoctorDashboardData);
router.get("/doctor/:id/appointments", getDoctorAppointments); // New route for appointments
router.post("/doctor/:id/appointment", updateAppointmentStatus);
router.post("/doctor/:id/prescription", createPrescription);

export default router;