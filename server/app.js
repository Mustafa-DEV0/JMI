import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import docterListRoutes from "./routes/doctorListRoutes.js";

dotenv.config();

connectDB(); // Connect to Database

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", patientRoutes);
app.use("/api", doctorRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/doctorList", docterListRoutes);

export default app;
