import express from "express";
import { saveMedicalStoreDetails } from "../controllers/medicalownerController.js";
const router = express.Router();

// Route to handle patient details submission
router.post("/medicalowner/:id", saveMedicalStoreDetails);

export default router;
