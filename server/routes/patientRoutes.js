import express from "express";
import { savePatientDetails } from "../controllers/patientController.js";

const router = express.Router();

// Route to handle patient details submission
router.post("/:id", savePatientDetails);

export default router;
