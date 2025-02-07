import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup.jsx";
import Login from "../pages/login/login.jsx";
import Home from "../pages/home/Home.jsx";
import Doctor from "../pages/doctor/Doctor.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor" element={<Doctor />} />
    </Routes>
  );
};

export default AppRoutes;
