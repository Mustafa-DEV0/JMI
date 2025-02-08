// routes/adminDashboardRoutes.js
import express from 'express';
import {
  getDashboardStats,
  getPatients,
  getDoctors,
  getMedicalStores,
  verifyDoctor,
  verifyStore,
  deleteUser
} from '../controllers/adminDashboardController.js';
const router = express.Router();

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/patients', getPatients);
router.get('/doctors', getDoctors);
router.get('/medical-stores', getMedicalStores);

// Verification routes
router.put('/verify/doctor/:id', verifyDoctor);
router.put('/verify/store/:id', verifyStore);

// Delete routes
router.delete('/delete/:type/:id', deleteUser);

export default router;