import express from "express";
import { putDoctorDetails } from "../controllers/doctorController.js";

const router = express.Router();

router.put("/:id", putDoctorDetails);

export default router;
