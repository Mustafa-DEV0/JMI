import Doctor from "../models/Doctor.js";

const getDoctors = async (req, res) => { 
    try {
      const { specialization, experience, day, minFee, maxFee, search } = req.query;
      let filter = {};

      if (specialization && specialization !== "All") {
        filter["professionalDetails.specialization"] = specialization;
      }

      if (experience && experience !== "All") {
        if (experience === "0-5 Years") {
          filter["professionalDetails.experience"] = { $lte: 5 };
        } else if (experience === "5-10 Years") {
          filter["professionalDetails.experience"] = { $gt: 5, $lte: 10 };
        } else if (experience === "10+ Years") {
          filter["professionalDetails.experience"] = { $gt: 10 };
        }
      }

      if (day && day !== "All") {
        filter["availability.days"] = { $in: [day] };
      }

      if (minFee || maxFee) {
        filter["professionalDetails.consultingFees"] = {};
        if (minFee) filter["professionalDetails.consultingFees"].$gte = parseInt(minFee);
        if (maxFee) filter["professionalDetails.consultingFees"].$lte = parseInt(maxFee);
      }

      if (search) {
        filter.$or = [
          { "personalDetails.name": { $regex: search, $options: "i" } },
          { "professionalDetails.specialization": { $regex: search, $options: "i" } },
        ];
      }

      console.log("🛠 Applied Filter:", filter); // Debugging logs

      // ✅ Apply the filter properly
      const doctors = await Doctor.find(filter).lean();

      // ✅ Use Optional Chaining (`?.`) to avoid errors
      const formattedDoctors = doctors.map(doctor => ({
        id: doctor._id,
        name: doctor.personalDetails?.name || "N/A",
        qualification: doctor.professionalDetails?.qualification || "N/A",
        age: doctor.personalDetails?.age || "N/A",
        phone: doctor.personalDetails?.phone || "N/A",
        specialization: doctor.professionalDetails?.specialization || "N/A",
        experience: doctor.professionalDetails?.experience || "N/A",
        consultationFee: doctor.professionalDetails?.consultingFees || "N/A",
        availability: doctor.availability?.days || [],
        clinicAddress: doctor.clinicOrHospital?.address || "Not Available"
      }));
      
      res.json(formattedDoctors);

    } catch (error) {
      console.error("❌ Error fetching doctors:", error);
      res.status(500).json({ message: "Server error", error });
    }
};

export { getDoctors };
