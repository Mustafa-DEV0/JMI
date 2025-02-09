import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Calendar,
  Heart,
  Ruler,
  MapPin,
  AlertCircle,
  Weight,
  Pill as Pills,
  Trash2,
} from "lucide-react";
import styles from "./PatientDetail.module.css";
import { useParams } from "react-router-dom";

const PatientDetail = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    phone: "",
    dob: "",
    age: "",
    gender: "",
    address: { city: "", state: "", pincode: "" },
    emergencyContact: { name: "", phone: "", relation: "" },
  });
  const [medicalDetails, setMedicalDetails] = useState({
    bloodGroup: "",
    height: "",
    weight: "",
    allergies: [""],
    diseases: [""],
    currentMedication: [{ tabletName: "", dosage: "", duration: "" }],
  });

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setPersonalDetails((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setPersonalDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMedicalDetailsChange = (e) => {
    const { name, value } = e.target;
    setMedicalDetails((prev) => ({ ...prev, [name]: value }));
  };

  const { id } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/patient/details/${id}`,
        {
          personalDetails,
          medicalDetails,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      setTimeout(() => {
        navigate(`/patient/dashboard/${id}`);
      }, 2000);
    } catch (error) {
      alert("Failed to save details");
      console.error("Error:", error);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveTab("medical");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMedication = (index) => {
    setMedicalDetails((prev) => ({
      ...prev,
      currentMedication: prev.currentMedication.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Patient Details</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "personal" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("personal")}
        >
          <User size={20} />
          Personal Details
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "medical" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("medical")}
        >
          <Heart size={20} />
          Medical Details
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {activeTab === "personal" ? (
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label>
                <User size={18} />
              </label>
              <input
                type="text"
                name="name"
                value={personalDetails.name}
                onChange={handlePersonalDetailsChange}
                placeholder="Enter full name"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>
                  <Phone size={18} />
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={personalDetails.phone}
                  onChange={handlePersonalDetailsChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Calendar size={18} />
                </label>
                <input
                  type="date"
                  name="dob"
                  value={personalDetails.dob}
                  onChange={handlePersonalDetailsChange}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label></label>
                <input
                  type="text"
                  name="age"
                  value={personalDetails.age}
                  onChange={handlePersonalDetailsChange}
                  placeholder="Enter age"
                />
              </div>

              <div className={styles.formGroup}>
                <label></label>
                <select
                  name="gender"
                  value={personalDetails.gender}
                  onChange={handlePersonalDetailsChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.addressSection}>
              <h3>
                <MapPin size={18} />
                Address Details
              </h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="address.city"
                    value={personalDetails.address.city}
                    onChange={handlePersonalDetailsChange}
                    placeholder="City"
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="address.state"
                    value={personalDetails.address.state}
                    onChange={handlePersonalDetailsChange}
                    placeholder="State"
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="address.pincode"
                    value={personalDetails.address.pincode}
                    onChange={handlePersonalDetailsChange}
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </div>

            <div className={styles.emergencySection}>
              <h3>Emergency Contact</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={personalDetails.emergencyContact.name}
                    onChange={handlePersonalDetailsChange}
                    placeholder="Contact Name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={personalDetails.emergencyContact.phone}
                    onChange={handlePersonalDetailsChange}
                    placeholder="Contact Phone"
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="emergencyContact.relation"
                    value={personalDetails.emergencyContact.relation}
                    onChange={handlePersonalDetailsChange}
                    placeholder="Relation"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleNext}
                className={styles.nextButton}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.section}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>
                  <Heart size={18} />
                </label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={medicalDetails.bloodGroup}
                  onChange={handleMedicalDetailsChange}
                  placeholder="Enter blood group"
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Ruler size={18} />
                </label>
                <input
                  type="text"
                  name="height"
                  value={medicalDetails.height}
                  onChange={handleMedicalDetailsChange}
                  placeholder="Enter height (cm)"
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Weight size={18} />
                </label>
                <input
                  type="text"
                  name="weight"
                  value={medicalDetails.weight}
                  onChange={handleMedicalDetailsChange}
                  placeholder="Enter weight (kg)"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                <AlertCircle size={18} />
              </label>
              <input
                type="text"
                placeholder="Enter allergies (comma separated)"
                value={medicalDetails.allergies.join(", ")}
                onChange={(e) =>
                  setMedicalDetails((prev) => ({
                    ...prev,
                    allergies: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  }))
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <AlertCircle size={18} />
              </label>
              <input
                type="text"
                placeholder="Enter existing conditions (comma separated)"
                value={medicalDetails.diseases.join(", ")}
                onChange={(e) =>
                  setMedicalDetails((prev) => ({
                    ...prev,
                    diseases: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  }))
                }
              />
            </div>

            <div className={styles.medicationSection}>
              <h3>
                <Pills size={18} />
                Current Medication
              </h3>
              {medicalDetails.currentMedication.map((med, index) => (
                <div key={index} className={styles.medicationRow}>
                  <input
                    type="text"
                    placeholder="Medication name"
                    value={med.tabletName}
                    onChange={(e) => {
                      const newMeds = [...medicalDetails.currentMedication];
                      newMeds[index] = { ...med, tabletName: e.target.value };
                      setMedicalDetails((prev) => ({
                        ...prev,
                        currentMedication: newMeds,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (in mg)"
                    value={med.dosage}
                    onChange={(e) => {
                      const newMeds = [...medicalDetails.currentMedication];
                      newMeds[index] = { ...med, dosage: e.target.value };
                      setMedicalDetails((prev) => ({
                        ...prev,
                        currentMedication: newMeds,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Duration (in weeks)"
                    value={med.duration}
                    onChange={(e) => {
                      const newMeds = [...medicalDetails.currentMedication];
                      newMeds[index] = { ...med, duration: e.target.value };
                      setMedicalDetails((prev) => ({
                        ...prev,
                        currentMedication: newMeds,
                      }));
                    }}
                  />
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDeleteMedication(index)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.addButton}
                onClick={() =>
                  setMedicalDetails((prev) => ({
                    ...prev,
                    currentMedication: [
                      ...prev.currentMedication,
                      { tabletName: "", dosage: "", duration: "" },
                    ],
                  }))
                }
              >
                + Add Medication
              </button>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Save Details
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PatientDetail;
