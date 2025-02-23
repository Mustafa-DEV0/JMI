import express from "express";
import { saveMedicalStoreDetails, getMedicalStoreDetails,
    getMedicalStoreOrders,
    updateOrderStatus } from "../controllers/medicalownerController.js";
const router = express.Router();


// Routes
router.get("/details/:id", getMedicalStoreDetails);
router.get("/orders/:id", getMedicalStoreOrders);




router.post("/details/:id", saveMedicalStoreDetails);

router.patch("/orders/:orderId/status", updateOrderStatus);

export default router;
    