import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup.jsx";
import Login from "../pages/login/Login.jsx";
import Home from "../pages/home/Home.jsx";
import Prescription from "../pages/prescription/Prescription.jsx";
import DoctorList from "../pages/doctorlist/DoctorList.jsx";
import MedicalStore from "../pages/medicalstore/MedicalStore.jsx";
import Payment from "../pages/payment/Payment.jsx";
import PatientAppointmentHistory from "../pages/patient appointment history/PatientAppointmentHistory.jsx";
import PatientDetails from "../pages/patient/PatientDetails.jsx";
import DoctorDetails from "../pages/doctor/DoctorDetails.jsx";
import Dashboard from "../pages/userdashboard/Dashboard.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor/:id" element={<DoctorDetails />} />
      <Route path="/patient/:id" element={<PatientDetails />} />
      <Route path="/prescription/:id" element={<Prescription />} />
      <Route path="/doctorlist" element={<DoctorList />} />
      <Route path="/medical-store" element={<MedicalStore />} />
      <Route path="/history" element={<PatientAppointmentHistory />} />
      <Route path="/userdashboard" element={<Dashboard />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
};

export default AppRoutes;
