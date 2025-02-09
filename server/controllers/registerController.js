import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import MedicalStore from "../models/MedicalStore.js";

export const registerController = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let userModel;
    switch (userType) {
      case "patient":
        userModel = Patient;
        break;
      case "doctor":
        userModel = Doctor;
        break;
      case "admin":
        userModel = Patient;
        break;
      case "medicalowner":
        userModel = MedicalStore;
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ email, password: hashedPassword });
    console.log(newUser);
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: `${
        userType.charAt(0).toUpperCase() + userType.slice(1)
      } registered successfully`,
      token,
      id: newUser._id,
      userType,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
