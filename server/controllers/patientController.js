import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import MedicalOrder from "../models/MedicalOrder.js";
import mongoose from "mongoose";
import FormData from "form-data";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();

export const getPatientDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    const [patient, appointments, prescriptions, orders] = await Promise.all([
      Patient.findById(id).select("-password"),
      Appointment.find({ patient: id }).populate("doctor"),
      Prescription.find({ patient: id }).populate("doctor"),
      MedicalOrder.find({ patient: id }).populate("medical"),
    ]);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get upcoming appointments
    const upcomingAppointments = appointments.filter(
      (app) =>
        app.status === "scheduled" && new Date(app.scheduledAt) > new Date()
    );

    res.json({
      patient, 
      upcomingAppointments,
      prescriptions,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const patient = await Patient.findByIdAndUpdate(id, updates, { new: true });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await Appointment.find({ patient: id })
      .populate("doctor")
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientPrescriptions = async (req, res) => {
  try {
    const { id } = req.params;
    const prescriptions = await Prescription.find({ patient: id })
      .populate("doctor")
      .sort({ issuedAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await MedicalOrder.find({ patient: id })
      .populate("medical")
      .sort({ orderedAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postPatientDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { personalDetails, medicalDetails } = req.body;
    console.log(req.body);
    const patient = await Patient.findByIdAndUpdate(id, {
      personalDetails,
      medicalDetails,
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});






export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Convert Buffer to Base64
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "uploads",
    });

    res.json( result.secure_url );
    console.log(result.secure_url)
  } catch (error) {
    console.error("Upload error:", error);
    console.log("error:",error)
    res.status(500).json({ message: "Upload failed" });
  }
};



export const createMedicalOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Validate required fields
    if (!orderData.patient || !orderData.medical || !orderData.medicines || !orderData.prescriptionImage) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure that patient and medical are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(orderData.patient) || !mongoose.Types.ObjectId.isValid(orderData.medical)) {
      return res.status(400).json({ message: 'Invalid patient or medical ID' });
    }

    const newOrder = new MedicalOrder({
      patient: orderData.patient,
      medical: orderData.medical,
      medicines: orderData.medicines,
      prescriptionImage: orderData.prescriptionImage,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

