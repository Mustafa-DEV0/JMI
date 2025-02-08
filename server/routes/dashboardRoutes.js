import express from "express";
import { getUserDashboard } from "../controllers/userdashboardController.js";

const router = express.Router();

router.get("/:id", getUserDashboard);

export default router;
