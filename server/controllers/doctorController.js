import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";

export const getDoctorDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    const [doctor, appointments, prescriptions] = await Promise.all([
      Doctor.findById(id).select("-password"),
      Appointment.find({ doctor: id }).populate("patient"),
      Prescription.find({ doctor: id }).populate("patient"),
    ]);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Categorize appointments
    const pendingAppointments = appointments.filter(
      (app) => app.status === "pending"
    );
    const upcomingAppointments = appointments.filter(
      (app) => app.status === "scheduled"
    );
    const completedAppointments = appointments.filter(
      (app) => app.status === "completed"
    );

    res.json({
      doctor,
      appointments: {
        pending: pendingAppointments,
        upcoming: upcomingAppointments,
        completed: completedAppointments,
      },
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionData } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(id, {
      personalDetails: submissionData.personalDetails,
      professionalDetails: submissionData.professionalDetails,
      availability: submissionData.availability,
      clinicOrHospital: submissionData.clinicOrHospital,
    });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await Appointment.find({ doctor: id })
      .populate("patient")
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate("patient");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDoctorPrescriptions = async (req, res) => {
  try {
    const { id } = req.params;
    const prescriptions = await Prescription.find({ doctor: id })
      .populate("patient")
      .sort({ issuedAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
