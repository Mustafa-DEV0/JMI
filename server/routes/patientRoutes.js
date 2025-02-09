import express from "express";
import {
  getPatientDashboard,
  updatePatientProfile,
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientOrders,
  postPatientDetails,
} from "../controllers/patientController.js";

const router = express.Router();

router.post("/details/:id", postPatientDetails);
router.get("/dashboard/:id", getPatientDashboard);
router.put("/profile/:id", updatePatientProfile);
router.get("/appointments/:id", getPatientAppointments);
router.get("/prescriptions/:id", getPatientPrescriptions);
router.get("/orders/:id", getPatientOrders);

export default router;
