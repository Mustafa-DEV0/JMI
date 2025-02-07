import express from "express";
import { putDoctorDetails } from "../controllers/doctorController.js";

const router = express.Router();

router.put("/doctor/:id", putDoctorDetails);

export default router;
