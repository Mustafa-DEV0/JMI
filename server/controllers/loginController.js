import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import MedicalStore from "../models/MedicalStore.js";

dotenv.config();

export const loginController = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    let user;
    switch (userType) {
      case "patient":
        user = await Patient.findOne({ email });
        break;
      case "admin":
        user = await Patient.findOne({ isAdmin: true });
        break;
      case "doctor":
        user = await Doctor.findOne({ email });
        break;
      case "medicalowner":
        user = await MedicalStore.findOne({ email });
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
