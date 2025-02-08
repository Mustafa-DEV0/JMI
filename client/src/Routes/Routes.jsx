import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup.jsx";
import Login from "../pages/login/login.jsx";
import Home from "../pages/home/Home.jsx";
import Doctor from "../pages/doctor/Doctor.jsx";
import Patient from "../pages/patient/Patient.jsx";
import Prescription from "../pages/prescription/Prescription.jsx";
import DoctorList from "../pages/doctorlist/DoctorList.jsx";
import MedicalStore from "../pages/medicalstore/MedicalStore.jsx";
import MedicalPrescription from "../pages/medicalprescription/MedicalPrescription.jsx";
import Appointment from "../pages/appointment/Appointment.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/patient/:id" element={<Patient />} />
      <Route path="/prescription" element={<Prescription />} />
      <Route path="/doctorlist" element={<DoctorList />} />
      <Route path="/medicalstore" element={<MedicalStore />} />
      <Route path="/medicalprescription" element={<MedicalPrescription />} />
      <Route path="/appointment" element={<Appointment />} />


    </Routes>
  );
};

export default AppRoutes;
