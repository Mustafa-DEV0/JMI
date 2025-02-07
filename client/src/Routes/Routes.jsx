import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup.jsx";
import Login from "../pages/login/login.jsx";
import Home from "../pages/home/Home.jsx";
import Doctor from "../pages/doctor/Doctor.jsx";
import Patient from "../pages/patient/Patient.jsx";
import Prescription from "../pages/prescription/Prescription.jsx";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor/:id" element={<Doctor />} />
      <Route path="/patient/:id" element={<Patient />} />
      <Route path="/prescription" element={<Prescription />} />
    </Routes>
  );
};

export default AppRoutes;
