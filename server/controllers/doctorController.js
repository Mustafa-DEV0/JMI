import Doctor from "../models/Doctor.js";

const postDoctorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      isVerified,
      personalDetails,
      professionalDetails,
      availability,
      clinicOrHospital,
    } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, {
      isVerified,
      personalDetails,
      professionalDetails,
      availability,
      clinicOrHospital,
    });

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export { postDoctorDetails };
