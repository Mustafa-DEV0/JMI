import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup.jsx";
import Login from "../pages/login/Login.jsx";  
import Home from "../pages/home/Home.jsx";
import Doctor from "../pages/doctor/Doctor.jsx";
import Patient from "../pages/patient/Patient.jsx";
import Prescription from "../pages/prescription/Prescription.jsx";
import DoctorList from "../pages/doctorlist/DoctorList.jsx";
import MyAppointment from "../pages/myappointment/Myappointment.jsx"; 
import MedicalStore from "../pages/medicalstore/MedicalStore.jsx";
import Appointment from "../pages/appointment/appointment.jsx";
import UserDashboard from "../pages/userdashboard/UserDashboard.jsx";
import Payment from "../pages/payment/Payment.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/patient/:id" element={<Patient />} />
      <Route path="/appointment/:id" element={<Appointment />} />
      <Route path="/prescription/:id" element={<Prescription />} />
      <Route path="/doctorlist" element={<DoctorList />} />
      <Route path="/myappointment" element={<MyAppointment />} />
      <Route path="/medicalstore" element={<MedicalStore />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/userdashboard" element={<UserDashboard />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
};

export default AppRoutes;
