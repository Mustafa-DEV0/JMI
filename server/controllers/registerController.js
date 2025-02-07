import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";

export const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email is already in use
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new patient
    const newPatient = new Patient({
      email,
      password: hashedPassword,
    });

    

    await newPatient.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { id: newPatient._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      patient: { id: newPatient._id, email: newPatient.email },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
