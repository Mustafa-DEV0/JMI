import express from "express";
import { postDoctorDetails } from "../controllers/doctorController.js";

const router = express.Router();

router.route("/doctor/:id").post(postDoctorDetails);

export default router;
