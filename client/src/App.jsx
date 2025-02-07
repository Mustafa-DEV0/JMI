import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Move Router here
import AppRoutes from "./Routes/Routes.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
      <Footer />
    </Router>
  );
}

export default App;
