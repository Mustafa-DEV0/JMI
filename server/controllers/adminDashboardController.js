import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import MedicalStore from '../models/MedicalStore.js';

// Function to get the dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Fetch all counts in parallel
    const [patientsCount, activeDoctors, activeStores, pendingDoctors, pendingStores] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments({ status: 'active' }),
      MedicalStore.countDocuments({ status: 'active' }),
      Doctor.countDocuments({ status: 'pending' }),
      MedicalStore.countDocuments({ status: 'pending' })
    ]);

    // Total pending verifications
    const pendingVerifications = pendingDoctors + pendingStores;

    const stats = {
      totalPatients: patientsCount,
      verifiedDoctors: activeDoctors,
      verifiedStores: activeStores,
      pendingVerifications,
    };

    // Placeholder for recent activities
    const activities = await getRecentActivities(); // This should fetch recent activity data

    res.json({ stats, activities });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: 'Error fetching dashboard data', details: error.message });
  }
};


// Generic fetch function for any entity (patients, doctors, stores)
const fetchEntities = async (model, query, page, limit) => {
  const total = await model.countDocuments(query);
  const entities = await model.find(query).select('-password').limit(limit).skip((page - 1) * limit);
  return { entities, totalPages: Math.ceil(total / limit), currentPage: page };
};

// Function to get patients
const getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const data = await fetchEntities(Patient, query, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', details: error.message });
  }
};

// Function to get doctors
const getDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'active' } = req.query;
    const query = { status, ...(search && { name: { $regex: search, $options: 'i' } }) };
    const data = await fetchEntities(Doctor, query, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', details: error.message });
  }
};

// Function to get medical stores
const getMedicalStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'active' } = req.query;
    const query = { status, ...(search && { name: { $regex: search, $options: 'i' } }) };
    const data = await fetchEntities(MedicalStore, query, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical stores', details: error.message });
  }
};

// Function to verify an entity (doctor or store)
const verifyEntity = async (model, req, res) => {
  try {
    const entity = await model.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!entity) return res.status(404).json({ message: `${model.modelName} not found` });
    res.json(entity);
  } catch (error) {
    res.status(500).json({ message: `Error verifying ${model.modelName}`, details: error.message });
  }
};

// Function to verify a doctor
const verifyDoctor = (req, res) => verifyEntity(Doctor, req, res);

// Function to verify a medical store
const verifyStore = (req, res) => verifyEntity(MedicalStore, req, res);

// Function to delete a user (patient, doctor, store)
const deleteUser = async (req, res) => {
  try {
    const { id, type } = req.params;
    const models = { patient: Patient, doctor: Doctor, store: MedicalStore };
    const model = models[type.toLowerCase()];

    if (!model) return res.status(400).json({ message: 'Invalid user type' });

    const result = await model.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', details: error.message });
  }
};

export {
  getDashboardStats,
  getPatients,
  getDoctors,
  getMedicalStores,
  verifyDoctor,
  verifyStore,
  deleteUser,
};
