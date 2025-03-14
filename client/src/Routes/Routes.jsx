import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup.jsx";
import Login from "../pages/login/Login.jsx";
import Home from "../pages/home/Home.jsx";
import Prescription from "../pages/prescription/Prescription.jsx";
import DoctorList from "../pages/doctorlist/DoctorList.jsx";
import MedicalStore from "../pages/medicalstore/MedicalStore.jsx";
import Payment from "../pages/payment/Payment.jsx";
import PatientAppointmentHistory from "../pages/patient appointment history/PatientAppointmentHistory.jsx";
import PatientDetail from "../pages/patient/PatientDetail.jsx";
import DoctorDetails from "../pages/doctor/DoctorDetails.jsx";
import Dashboard from "../pages/userdashboard/Dashboard.jsx";
import Appointment from "../pages/appointment/Appointment.jsx";
import AdminDashboard from "../pages/admindashboard/AdminDashboard.jsx";
import DoctorDashboard from "../pages/doctordashboard/Doctordashboard.jsx";
import MedicalDetails from "../pages/medicaldetails/MedicalDetails.jsx";
import MedicalDashboard from "../pages/medicalownerdashboard/MedicalDashboard.jsx";
import MedicalOrder from "../pages/medicalOrder/Medicalorder.jsx";
import MedicalPrescription from "../pages/medicalprescription/MedicalPrescription.jsx";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor/:id" element={<DoctorDetails />} />
      <Route path="/patient/:id" element={<PatientDetail />} />
      <Route path="/prescription/:id" element={<Prescription />} />
      <Route path="/appointment/:id" element={<Appointment />} />
      <Route path="/patient/dashboard/:id" element={<Dashboard />} />
      <Route path="/doctors" element={<DoctorList />} />
      <Route path="/medicalstore" element={<MedicalStore />} />
      <Route path="/history" element={<PatientAppointmentHistory />} />
      <Route path="/doctor/dashboard/:id" element={<DoctorDashboard />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/admin/dashboard/:id" element={<AdminDashboard />} />
      <Route path="/medicalowner/:id" element={<MedicalDetails />} />
      <Route path="/medicalowner/dashboard/:id" element={<MedicalDashboard />} />
      <Route path="/medicalorder/:id" element={<MedicalOrder />} />
      <Route path="/medicalprescription" element={<MedicalPrescription />} />
      
    </Routes>
  );
};

export default AppRoutes;
