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
import Appointment from "../pages/Appointment/appointment.jsx";
<<<<<<< HEAD
import DoctorDashboard from "../pages/doctordashbord/Doctordashbord.jsx"
import MedicalDashboard from "../pages/medicalownerdashboard/MedicalDashboard.jsx";
=======
import AdminDashboard from "../pages/admindashboard/AdminDashboard.jsx";
import DoctorDashboard from "../pages/doctordashbord/Doctordashboard.jsx";
>>>>>>> c51b07ddd3f87598eed40f83d8e9d9df41fd5e7d

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
      <Route path="/doctorlist" element={<DoctorList />} />
      <Route path="/medical-store" element={<MedicalStore />} />
      <Route path="/history" element={<PatientAppointmentHistory />} />
      <Route path="/dashboard/:id" element={<Dashboard />} />
      <Route path="/payment" element={<Payment />} />
<<<<<<< HEAD
=======
      <Route path="/admindashboard" element={<AdminDashboard />} />
>>>>>>> c51b07ddd3f87598eed40f83d8e9d9df41fd5e7d
      <Route path="/doctordashboard" element={<DoctorDashboard />} />
      <Route path="/medicaldashboard" element={<MedicalDashboard />} />

    </Routes>
  );
};

export default AppRoutes;
