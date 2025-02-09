import express from "express";
import {
  getDoctorDashboard,
  postDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorPrescriptions,
} from "../controllers/doctorController.js";

const router = express.Router();

router.get("/dashboard/doctor/:id", getDoctorDashboard);
router.post("/details/:id", postDoctorProfile);
router.get("/dashboard/doctor/:id/appointment", getDoctorAppointments);
router.put("/appointments/:appointmentId", updateAppointmentStatus);
router.get("/dashboard/doctor/:id/prescription", getDoctorPrescriptions);

export default router;
