import express from "express";
import {
  getAdminDashboard,
  deletePatient,
  deleteDoctor,
  deleteMedicalStore,
  verifyDoctor,
  verifyMedicalStore,
} from "../controllers/adminDashboardController.js";

const router = express.Router();

// Dashboard data
router.get("/admin", getAdminDashboard);

// Delete operations
router.delete("/patient/:id", deletePatient);
router.delete("/doctor/:id", deleteDoctor);
router.delete("/store/:id", deleteMedicalStore);

// Verify operations
router.put("/doctor/verify/:id", verifyDoctor);
router.put("/store/verify/:id", verifyMedicalStore);

export default router;
