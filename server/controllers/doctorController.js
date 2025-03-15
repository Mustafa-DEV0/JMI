import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Prescription from "../models/Prescription.js";

export const postDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionData } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(id, {
      personalDetails: submissionData.personalDetails,
      professionalDetails: submissionData.professionalDetails,
      availability: submissionData.availability,
      clinicOrHospital: submissionData.clinicOrHospital,
    });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDoctorDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    const allAppointments = await Appointment.find({ doctor: id })
      .populate({
        path: "patient",
        model: "Patient",
        select: "-password -isAdmin",
      });

    // Get unique patients from all appointments
    const uniquePatientIds = [...new Set(allAppointments.map(appt => appt.patient._id.toString()))];
    const allPatients = await Patient.find({ _id: { $in: uniquePatientIds } });

    // Categorize patients based on their latest appointment status
    const patientCategories = {
      new: [],
      current: [],
      discharged: []
    };

    // For each patient, find their latest appointment to determine their status
    for (const patient of allPatients) {
      const patientAppointments = allAppointments.filter(
        appt => appt.patient._id.toString() === patient._id.toString()
      );
      const latestAppointment = patientAppointments.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      if (latestAppointment) {
        switch (latestAppointment.status) {
          case 'pending':
            patientCategories.new.push(patient);
            break;
          case 'scheduled':
            patientCategories.current.push(patient);
            break;
          case 'completed':
            patientCategories.discharged.push(patient);
            break;
        }
      }
    }

    // Categorize appointments
    const appointmentCategories = {
      pending: allAppointments.filter(appt => appt.status === 'pending'),
      upcoming: allAppointments.filter(appt => appt.status === 'scheduled'),
      completed: allAppointments.filter(appt => appt.status === 'completed')
    };

    res.json({
      allPatients,
      newPatients: patientCategories.new,
      currentPatients: patientCategories.current,
      dischargedPatients: patientCategories.discharged,
      appointments: appointmentCategories
    });
  } catch (error) {
    console.error("Error in getDoctorDashboardData:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


 export const getDoctors = async (req, res) => { 
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


