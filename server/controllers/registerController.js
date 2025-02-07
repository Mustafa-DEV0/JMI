import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

export const registerController = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists (Doctor or Patient)
    const existingUser = await (userType === "doctor"
      ? Doctor.findOne({ email })
      : Patient.findOne({ email }));

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data
    const userData = { email, password: hashedPassword, createdAt: new Date() };

    let newUser;

    // Create a new Doctor or Patient based on userType
    if (userType === "doctor") {
      newUser = new Doctor({
        ...userData,
        verified: false, // Default for doctor
      });
      await newUser.save();
      res.status(201).json({ message: "Doctor registered successfully" });
    } else if (userType === "patient") {
      newUser = new Patient(userData);
      await newUser.save();

      // Generate JWT token for patient
      const token = jwt.sign(
        { id: newUser._id, userType },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "Patient registration successful",
        token,
        user: { id: newUser._id, email, userType },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
