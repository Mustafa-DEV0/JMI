import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Prescription from "../models/Prescription.js";
import mongoose from "mongoose";

export const getDoctorDashboardData = async (req, res) => {
  try {
    const { id } = req.params;

    const allAppointments = await Appointment.find({ doctor: id })
      .populate({
        path: "patient",
        model: "Patient",
        select: "-password -isAdmin",
      });

    // Get unique patients from all appointments
    const uniquePatientIds = [...new Set(allAppointments.map(appt => appt.patient._id.toString()))];
    const allPatients = await Patient.find({ _id: { $in: uniquePatientIds } });

    // Categorize patients based on their latest appointment status
    const patientCategories = {
      new: [],
      current: [],
      discharged: []
    };

    // For each patient, find their latest appointment to determine their status
    for (const patient of allPatients) {
      const patientAppointments = allAppointments.filter(
        appt => appt.patient._id.toString() === patient._id.toString()
      );
      const latestAppointment = patientAppointments.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      if (latestAppointment) {
        switch (latestAppointment.status) {
          case 'pending':
            patientCategories.new.push(patient);
            break;
          case 'scheduled':
            patientCategories.current.push(patient);
            break;
          case 'completed':
            patientCategories.discharged.push(patient);
            break;
        }
      }
    }

    // Categorize appointments
    const appointmentCategories = {
      pending: allAppointments.filter(appt => appt.status === 'pending'),
      upcoming: allAppointments.filter(appt => appt.status === 'scheduled'),
      completed: allAppointments.filter(appt => appt.status === 'completed')
    };

    res.json({
      allPatients,
      newPatients: patientCategories.new,
      currentPatients: patientCategories.current,
      dischargedPatients: patientCategories.discharged,
      appointments: appointmentCategories
    });
  } catch (error) {
    console.error("Error in getDoctorDashboardData:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, action } = req.body;
    
    if (!appointmentId || !action) {
      return res.status(400).json({ message: "Missing appointmentId or action" });
    }

    let newStatus;
    switch (action) {
      case 'accept':
        newStatus = 'scheduled';
        break;
      case 'decline':
        newStatus = 'cancelled';
        break;
      case 'complete':
        newStatus = 'completed';
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: newStatus },
      { new: true }
    ).populate("patient");

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error in updateAppointmentStatus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, medications, notes } = req.body;

    if (!patientId || !doctorId || !medications) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prescription = new Prescription({
      patient: patientId,
      doctor: doctorId,
      medications: medications.map(med => ({
        medicine: med.name,
        dosage: med.dosage,
        duration: med.duration
      })),
      remarks: notes
    });

    const savedPrescription = await prescription.save();

    // If appointmentId is provided, update the appointment with the prescription reference
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        prescription: savedPrescription._id
      });
    }

    res.json({
      message: "Prescription created successfully",
      prescription: savedPrescription
    });
  } catch (error) {
    console.error("Error in createPrescription:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params; // doctor id
    const appointments = await Appointment.find({ doctor: id })
      .populate({
        path: "patient",
        model: "Patient",
        select: "-password -isAdmin",
      })
      .sort({ createdAt: -1 }); // sort appointments by latest

    // Transform appointments to include detailed information
    const appointmentDetails = appointments.map((appt) => ({
      _id: appt._id,
      status: appt.status,
      scheduledAt: appt.scheduledAt,
      createdAt: appt.createdAt,
      updatedAt: appt.updatedAt,
      concerns: appt.concerns,
      prescription: appt.prescription,
      patient: {
        _id: appt.patient._id,
        name:
          appt.patient.personalDetails?.name ||
          (appt.patient.email ? appt.patient.email.split("@")[0] : "Unknown"),
        email: appt.patient.email,
        phone: appt.patient.personalDetails?.phone || "N/A",
      },
      doctor: appt.doctor
    }));

    res.json({ appointments: appointmentDetails });
  } catch (error) {
    console.error("Error in getDoctorAppointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};