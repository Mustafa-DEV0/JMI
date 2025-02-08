import express from "express";
import  {getDoctors}  from "../controllers/doctorListController.js";
const router = express.Router();

router.get("/", getDoctors); // Route to get doctors

export default router;
