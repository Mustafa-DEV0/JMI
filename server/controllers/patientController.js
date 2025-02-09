import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import MedicalOrder from '../models/MedicalOrder.js';

export const getPatientDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    const [patient, appointments, prescriptions, orders] = await Promise.all([
      Patient.findById(id).select('-password'),
      Appointment.find({ patient: id }).populate('doctor'),
      Prescription.find({ patient: id }).populate('doctor'),
      MedicalOrder.find({ patient: id }).populate('medical')
    ]);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get upcoming appointments
    const upcomingAppointments = appointments.filter(app => 
      app.status === 'scheduled' && new Date(app.scheduledAt) > new Date()
    );

    res.json({
      patient,
      upcomingAppointments,
      prescriptions,
      orders
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
      return res.status(404).json({ message: 'Patient not found' });
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
      .populate('doctor')
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
      .populate('doctor')
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
      .populate('medical')
      .sort({ orderedAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};