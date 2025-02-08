import express from "express";
import { getUserDashboard } from "../controllers/userdashboardController.js";

const router = express.Router();

// ✅ Define a single route for fetching user dashboard data dynamically
router.get("/userdashboard/:id", getUserDashboard);

export default router;
