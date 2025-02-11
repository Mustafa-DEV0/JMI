import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import getUserIdFromJwt from "../utils/getUserId.js";

const getDoctorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const saveAppointmentDetails = async (req, res) => {
  try {
    const { doctorName, doctor, concerns, specialization, scheduledAt, mode } =
      req.body;
    console.log(req.body);
    const token = req.headers.authorization?.split(" ")[1];
    if (!doctor || !scheduledAt || !mode || !token) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const patientId = getUserIdFromJwt(token);
    if (!patientId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const appointmentData = {
      doctor,
      doctorName,
      patient: patientId,
      concerns,
      scheduledAt,
      specialization,
      mode,
    };
    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();
    console.log(newAppointment);

    res.status(200).json({ id: patientId });
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPatientHistory = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  try {
    const patientId = getUserIdFromJwt(token);
    const appointments = await Appointment.find({ patient: patientId });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching patient history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getDoctorDetails, saveAppointmentDetails, getPatientHistory };
