import React, { useState } from "react";
import { ChevronRight, User, Award, Clock } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DoctorDetails.module.css";
import API from "../../api/axios";

const DoctorDetails = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState({
    personalDetails: { name: "", age: "", phone: "", gender: "" },
    professionalDetails: {
      specialization: "",
      qualification: "",
      experience: "",
      mobileNumber: "",
      consultingFees: "",
      medicalLicenseId: "",
    },
    availability: {
      days: [],
      startTime: "09:00",
      endTime: "17:00",
      startPeriod: "AM",
      endPeriod: "PM",
    },
    clinicOrHospital: { address: "", officeNumber: "" },
  });

  const { id } = useParams();

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleDaysChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter((d) => d !== day)
          : [...prev.availability.days, day],
      },
    }));
  };

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return hour.toString().padStart(2, "0");
  });

  const minutes = ["00"];

  const generateTimeOptions = () => {
    return hours.flatMap((hour) =>
      minutes.map((minute) => `${hour}:${minute}`)
    );
  };

  const timeOptions = generateTimeOptions();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedTime = `${formData.availability.startTime} ${formData.availability.startPeriod} - ${formData.availability.endTime} ${formData.availability.endPeriod}`;
    const submissionData = {
      ...formData,
      availability: {
        ...formData.availability,
        time: formattedTime,
      },
    };
    console.log(submissionData);

    try {
      await axios.post(
        API + `/doctor/details/${id}`,
        { submissionData },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      navigate(`/doctor/dashboard/${id}`);
    } catch (error) {
      console.error("Error submitting doctor details:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Doctor Details</h1>

        <div className={styles.progressBar}>
          <div
            className={`${styles.progress} ${
              activeSection === "professional"
                ? styles.halfFilled
                : activeSection === "availability"
                ? styles.filled
                : ""
            }`}
          />
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Personal Details Section */}
          <div
            className={`${styles.section} ${
              activeSection === "personal" ? styles.active : ""
            }`}
          >
            <h2>
              <User className={styles.icon} /> Personal Details
            </h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.personalDetails.name}
                onChange={(e) => {
                  let name = e.target.value;
                  if (!name.startsWith("Dr ")) {
                    name = "Dr " + name.replace(/^Dr\s*/, ""); // Ensure only one "Dr "
                  }
                  handleInputChange("personalDetails", "name", name);
                }}
                required
              />

              <input
                type="number"
                placeholder="Age"
                value={formData.personalDetails.age}
                onChange={(e) =>
                  handleInputChange("personalDetails", "age", e.target.value)
                }
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.personalDetails.phone}
                onChange={(e) =>
                  handleInputChange("personalDetails", "phone", e.target.value)
                }
                required
              />
              <select
                value={formData.personalDetails.gender}
                onChange={(e) =>
                  handleInputChange("personalDetails", "gender", e.target.value)
                }
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="button"
              className={styles.nextButton}
              onClick={() => setActiveSection("professional")}
            >
              Next <ChevronRight size={20} />
            </button>
          </div>

          {/* Professional Details Section */}
          <div
            className={`${styles.section} ${
              activeSection === "professional" ? styles.active : ""
            }`}
          >
            <h2>
              <Award className={styles.icon} /> Professional Details
            </h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Specialization (Caps)"
                value={formData.professionalDetails.specialization}
                onChange={(e) =>
                  handleInputChange(
                    "professionalDetails",
                    "specialization",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="text"
                placeholder="Qualification (Caps)"
                value={formData.professionalDetails.qualification}
                onChange={(e) =>
                  handleInputChange(
                    "professionalDetails",
                    "qualification",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Years of Experience"
                value={formData.professionalDetails.experience}
                onChange={(e) =>
                  handleInputChange(
                    "professionalDetails",
                    "experience",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.professionalDetails.mobileNumber}
                onChange={(e) =>
                  handleInputChange(
                    "professionalDetails",
                    "mobileNumber",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Consulting Fees"
                value={formData.professionalDetails.consultingFees}
                onChange={(e) =>
                  handleInputChange(
                    "professionalDetails",
                    "consultingFees",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="text"
                placeholder="Medical License ID"
                value={formData.professionalDetails.medicalLicenseId}
                onChange={(e) =>
                  handleInputChange(
                    "professionalDetails",
                    "medicalLicenseId",
                    e.target.value
                  )
                }
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setActiveSection("personal")}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.nextButton}
                onClick={() => setActiveSection("availability")}
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Availability & Location Section */}
          <div
            className={`${styles.section} ${
              activeSection === "availability" ? styles.active : ""
            }`}
          >
            <h2>
              <Clock className={styles.icon} /> Availability & Location
            </h2>
            <div className={styles.inputGroup}>
              <div className={styles.daysSelector}>
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.dayButton} ${
                      formData.availability.days.includes(day)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDaysChange(day)}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              <div className={styles.timeSelector}>
                <div className={styles.timeGroup}>
                  <label>Start Time</label>
                  <div className={styles.timeInputGroup}>
                    <select
                      value={formData.availability.startTime}
                      onChange={(e) =>
                        handleInputChange(
                          "availability",
                          "startTime",
                          e.target.value
                        )
                      }
                      required
                    >
                      {timeOptions.map((time) => (
                        <option key={`start-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.availability.startPeriod}
                      onChange={(e) =>
                        handleInputChange(
                          "availability",
                          "startPeriod",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <div className={styles.timeGroup}>
                  <label>End Time</label>
                  <div className={styles.timeInputGroup}>
                    <select
                      value={formData.availability.endTime}
                      onChange={(e) =>
                        handleInputChange(
                          "availability",
                          "endTime",
                          e.target.value
                        )
                      }
                      required
                    >
                      {timeOptions.map((time) => (
                        <option key={`end-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.availability.endPeriod}
                      onChange={(e) =>
                        handleInputChange(
                          "availability",
                          "endPeriod",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Clinic/Hospital Address(Name,City,Pincode)"
                value={formData.clinicOrHospital.address}
                onChange={(e) =>
                  handleInputChange(
                    "clinicOrHospital",
                    "address",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="tel"
                placeholder="Office Number"
                value={formData.clinicOrHospital.officeNumber}
                onChange={(e) =>
                  handleInputChange(
                    "clinicOrHospital",
                    "officeNumber",
                    e.target.value
                  )
                }
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setActiveSection("professional")}
              >
                Back
              </button>
              <button type="submit" className={styles.submitButton}>
                Submit Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorDetails;
