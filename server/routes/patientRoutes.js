import express from "express";
import {
  getPatientDashboard,
  updatePatientProfile,
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientOrders,
  postPatientDetails,
  createMedicalOrder
} from "../controllers/patientController.js";

const router = express.Router();

router.post("/details/:id", postPatientDetails);
router.get("/dashboard/:id", getPatientDashboard);
router.put("/profile/:id", updatePatientProfile);
router.get("/appointments/:id", getPatientAppointments);
router.get("/prescriptions/:id", getPatientPrescriptions);
router.get("/orders/:id", getPatientOrders);
router.post("/order/:id", createMedicalOrder);

export default router;
