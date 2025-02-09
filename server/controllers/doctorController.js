import Doctor from "../models/Doctor.js";

const putDoctorDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      personalDetails: { name, age, phone, gender } = {},
      professionalDetails: {
        specialization,
        qualification,
        experience,
        mobileNumber,
        consultingFees,
        medicalLicenseId,
      } = {},
      availability: { days, time } = {},
      clinicOrHospital: { address, officeNumber } = {},
    } = req.body;
    // Check if the doctor exists first
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Proceed with updating the doctor's details
    doctor.personalDetails = {
      name: name || "",
      age: age || "",
      phone: phone || "",
      gender: gender || "",
    };
    doctor.professionalDetails = {
      specialization: specialization || "",
      qualification: qualification || "",
      experience: experience || "",
      mobileNumber: mobileNumber || "",
      consultingFees: consultingFees || "",
      medicalLicenseId: medicalLicenseId || "",
    };
    doctor.availability = { days: days || [], time: time || "" };
    doctor.clinicOrHospital = {
      address: address || "",
      officeNumber: officeNumber || "",
    };

    // Save the updated doctor details
    const saved = await doctor.save();

    if (saved) {
      window.location.href = `/dashboard/doctor/${id}`;
    } else {
      console.log("cant navigate");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export { putDoctorDetails };
