import express from 'express';
import {
  getDoctorDashboard,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorPrescriptions
} from '../controllers/doctorController.js';

const router = express.Router();

router.get('/dashboard/doctor/:id', getDoctorDashboard);
router.put('/profile/:id', updateDoctorProfile);
router.get('/dashboard/doctor/:id/appointment', getDoctorAppointments);
router.put('/appointments/:appointmentId', updateAppointmentStatus);
router.get('/dashboard/doctor/:id/prescription', getDoctorPrescriptions);

export default router;