import express from "express";
import {
  getDoctorDetails,
  saveAppointmentDetails,
} from "../controllers/appoinmentController.js";

const router = express.Router();

router.get("/get/:id", getDoctorDetails);
router.post("/save", saveAppointmentDetails);

export default router;
