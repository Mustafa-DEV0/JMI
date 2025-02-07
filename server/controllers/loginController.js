import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Patient from "../models/Patient";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the patient already exists
    let patient = await Patient.findOne({ email });

    if (patient) {
      // LOGIN: Verify password
      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      // REGISTER: Hash password and create new patient
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      patient = new Patient({ email, password: hashedPassword });
      await patient.save();
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Generate JWT token
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Authentication successful",
      token,
      patient: {
        id: patient._id,
        email: patient.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
