import express from "express";
import multer from "multer";
import {
  getPatientDashboard,
  updatePatientProfile,
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientOrders,
  postPatientDetails,
  createMedicalOrder,
  uploadImage
} from "../controllers/patientController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload=multer( {  storage } );

router.post("/details/:id", postPatientDetails);
router.get("/dashboard/:id", getPatientDashboard);
router.put("/profile/:id", updatePatientProfile);
router.get("/appointments/:id", getPatientAppointments);
router.get("/prescriptions/:id", getPatientPrescriptions);
router.get("/orders/:id", getPatientOrders);
router.post("/order/:id", createMedicalOrder);
router.post("/upload", upload.single("image"), uploadImage);

export default router;
