import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  X,
  Check,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Doctordashboard.module.css";
import API from "../../api/axios";
// Helper functions remain the same
const getPatientName = (patient) =>
  patient?.personalDetails?.name || patient?.email?.split("@")[0] || "Unknown";

const getPatientAge = (patient) => {
  if (patient?.personalDetails) {
    if (patient.personalDetails.age) return patient.personalDetails.age;
    if (patient.personalDetails.dob) {
      const dob = new Date(patient.personalDetails.dob);
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  }
  return "";
};

const getPatientGender = (patient) => patient?.personalDetails?.gender || "";

const getPatientReason = (patient) => patient?.concerns || "N/A";

const getPatientDate = (appointment) => {
  if (!appointment?.scheduledAt) return "Not scheduled";
  return new Date(appointment.scheduledAt).toLocaleDateString();
};

const getPatientTime = (appointment) => {
  if (!appointment?.scheduledAt) return "Not scheduled";
  return new Date(appointment.scheduledAt).toLocaleTimeString();
};

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState({
    pending: [],
    upcoming: [],
    completed: [],
  });
  const [patients, setPatients] = useState([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activePatientFilter, setActivePatientFilter] =
    useState("All Patients");
  const [appointmentTab, setAppointmentTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    medications: [{ name: "", dosage: "", duration: "" }],
    notes: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API + `/doctor/dashboard/${id}`);
        console.log(response.data);
        // Destructure and process response data
        const {
          allPatients = [],
          newPatients = [],
          currentPatients = [],
          dischargedPatients = [],
          appointments: backendAppointments = {},
        } = response.data;

        // Update patients with status
        const patientsWithStatus = allPatients.map((patient) => {
          if (newPatients.some((p) => p._id === patient._id)) {
            return { ...patient, status: "New" };
          } else if (currentPatients.some((p) => p._id === patient._id)) {
            return { ...patient, status: "Current" };
          } else if (dischargedPatients.some((p) => p._id === patient._id)) {
            return { ...patient, status: "Discharged" };
          }
          return { ...patient, status: "Unknown" };
        });

        setPatients(patientsWithStatus);
        setAppointments(backendAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id]);

  const handleAppointmentAction = async (appointmentId, type, action) => {
    try {
      const response = await axios.put(API + `/appointments/${appointmentId}`, {
        action,
      });

      if (response.data && response.data.updatedAppointment) {
        const updatedAppointment = response.data.updatedAppointment;

        setAppointments((prev) => {
          const newState = { ...prev };
          newState[type] = prev[type].filter(
            (app) => app._id !== appointmentId
          );

          if (updatedAppointment.status === "scheduled") {
            newState.upcoming = [...prev.upcoming, updatedAppointment];
          } else if (updatedAppointment.status === "completed") {
            newState.completed = [...prev.completed, updatedAppointment];
          } else if (updatedAppointment.status === "pending") {
            newState.pending = [...prev.pending, updatedAppointment];
          }
          return newState;
        });

        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError("Failed to update appointment");
    }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API + `/dashboard/doctor/${id}/prescription`,
        {
          ...newPrescription,
          doctorId: id,
        }
      );

      if (response.data) {
        setShowPrescriptionModal(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        // Reset form
        setNewPrescription({
          patientId: "",
          medications: [{ name: "", dosage: "", duration: "" }],
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
      setError("Failed to create prescription");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredPatients = patients.filter((patient) => {
    const name = getPatientName(patient);
    const matchesSearch =
      name.toLowerCase().includes(searchTerm) ||
      (patient.concerns && patient.concerns.toLowerCase().includes(searchTerm));
    if (activePatientFilter === "All Patients") return matchesSearch;
    return matchesSearch && patient.status === activePatientFilter;
  });

  // Keep existing render functions
  const renderPatientsList = () => (
    <div className={styles.contentArea}>
      <div className={styles.patientFilters}>
        <button
          className={`${styles.filterButton} ${
            activePatientFilter === "All Patients" ? styles.active : ""
          }`}
          onClick={() => setActivePatientFilter("All Patients")}
        >
          All Patients <span>{patients.length}</span>
        </button>
        <button
          className={`${styles.filterButton} ${
            activePatientFilter === "Current" ? styles.active : ""
          }`}
          onClick={() => setActivePatientFilter("Current")}
        >
          Current Patients{" "}
          <span>{patients.filter((p) => p.status === "Current").length}</span>
        </button>
        <button
          className={`${styles.filterButton} ${
            activePatientFilter === "New" ? styles.active : ""
          }`}
          onClick={() => setActivePatientFilter("New")}
        >
          New Patients{" "}
          <span>{patients.filter((p) => p.status === "New").length}</span>
        </button>
        <button
          className={`${styles.filterButton} ${
            activePatientFilter === "Discharged" ? styles.active : ""
          }`}
          onClick={() => setActivePatientFilter("Discharged")}
        >
          Discharged Patients{" "}
          <span>
            {patients.filter((p) => p.status === "Discharged").length}
          </span>
        </button>
      </div>

      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <button className={styles.addButton}>
          <Plus size={20} /> Add Patient
        </button>
      </div>

      <div className={styles.patientsList}>
        <div className={styles.patientsListHeader}>
          <div className={styles.headerCheckbox}></div>
          <div>Patient Name</div>
          <div>Reason</div>
          <div>Status</div>{" "}
          {/* Changed header from Schedule Time & Date to Status */}
        </div>
        {filteredPatients.map((patient) => {
          // Find the appointment for the current patient
          const upcomingAppointment = appointments.upcoming.find(
            (app) => app.patient?._id === patient._id
          );
          const pendingAppointment = appointments.pending.find(
            (app) => app.patient?._id === patient._id
          );
          const completedAppointment = appointments.completed.find(
            (app) => app.patient?._id === patient._id
          );
          const appointmentFound =
            upcomingAppointment || pendingAppointment || completedAppointment;
          // Destructure the status from the appointmentFound (defaults to 'Not scheduled')
          const { status = "Not scheduled" } = appointmentFound || {};

          return (
            <div
              key={patient._id}
              className={styles.patientRow}
              onClick={() => setSelectedPatient(patient)}
            >
              <div className={styles.checkbox}>
                <input type="checkbox" />
              </div>
              <div className={styles.patientInfo}>
                <img
                  src={
                    patient.personalDetails?.profileImg ||
                    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50"
                  }
                  alt={getPatientName(patient)}
                  className={styles.patientImage}
                />
                <div>
                  <h3>{getPatientName(patient)}</h3>
                  <p>
                    {getPatientAge(patient)} Y, {getPatientGender(patient)}
                  </p>
                </div>
              </div>
              <div className={styles.reason}>{getPatientReason(patient)}</div>
              <div className={styles.schedule}>
                <div>{status}</div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPatient && (
        <div className={styles.patientDetails}>
          <div className={styles.detailsHeader}>
            <h2>Patient Details</h2>
            <button onClick={() => setSelectedPatient(null)}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.detailsContent}>
            <div className={styles.patientHeader}>
              <img
                src={
                  selectedPatient.personalDetails?.profileImg ||
                  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50"
                }
                alt={getPatientName(selectedPatient)}
              />
              <div className={styles.patientContact}>
                <h3>{getPatientName(selectedPatient)}</h3>
                <p>
                  {getPatientAge(selectedPatient)} Y,{" "}
                  {getPatientGender(selectedPatient)}
                </p>
                <div className={styles.contactInfo}>
                  <div>
                    <span className={styles.icon}>📞</span>
                    {selectedPatient.personalDetails?.phone || "N/A"}
                  </div>
                  <div>
                    <span className={styles.icon}>✉️</span>
                    {selectedPatient.email}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.visitInfo}>
              <h4>Medical Details</h4>
              <div className={styles.visitDetails}>
                <div>
                  <span>Blood Group</span>
                  <p>{selectedPatient.medicalDetails?.bloodGroup || "N/A"}</p>
                </div>
                <div>
                  <span>Height</span>
                  <p>{selectedPatient.medicalDetails?.height || "N/A"} cm</p>
                </div>
                <div>
                  <span>Weight</span>
                  <p>{selectedPatient.medicalDetails?.weight || "N/A"} kg</p>
                </div>
              </div>
            </div>

            {selectedPatient.medicalDetails?.allergies && (
              <div className={styles.allergiesSection}>
                <h4>Allergies</h4>
                <div className={styles.allergiesList}>
                  {selectedPatient.medicalDetails.allergies.map(
                    (allergy, index) => (
                      <span key={index} className={styles.allergyTag}>
                        {allergy}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {selectedPatient.personalDetails?.emergencyContact && (
              <div className={styles.emergencyContact}>
                <h4>Emergency Contact</h4>
                <div className={styles.emergencyInfo}>
                  <div className={styles.contactPerson}>
                    <span>
                      {selectedPatient.personalDetails.emergencyContact.name}
                    </span>
                    <p>
                      {
                        selectedPatient.personalDetails.emergencyContact
                          .relation
                      }
                    </p>
                  </div>
                  <button className={styles.callButton}>
                    <span className={styles.icon}>📞</span>
                    {selectedPatient.personalDetails.emergencyContact.phone}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className={styles.contentArea}>
      <div className={styles.appointmentsTabs}>
        <button
          className={`${styles.tabButton} ${
            appointmentTab === "pending" ? styles.active : ""
          }`}
          onClick={() => setAppointmentTab("pending")}
        >
          Pending ({appointments.pending.length})
        </button>
        <button
          className={`${styles.tabButton} ${
            appointmentTab === "upcoming" ? styles.active : ""
          }`}
          onClick={() => setAppointmentTab("upcoming")}
        >
          Upcoming ({appointments.upcoming.length})
        </button>
        <button
          className={`${styles.tabButton} ${
            appointmentTab === "completed" ? styles.active : ""
          }`}
          onClick={() => setAppointmentTab("completed")}
        >
          Completed ({appointments.completed.length})
        </button>
      </div>

      <div className={styles.appointmentsList}>
        {appointments[appointmentTab]?.map((appointment) => (
          <div key={appointment._id} className={styles.appointmentCard}>
            <div className={styles.appointmentInfo}>
              <img
                src={
                  appointment.patient?.personalDetails?.profileImg ||
                  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50"
                }
                alt={getPatientName(appointment.patient)}
                className={styles.patientImage}
              />
              <div>
                <h3>{getPatientName(appointment.patient)}</h3>
                <p className={styles.reason}>{appointment.concerns}</p>
                <p className={styles.datetime}>
                  <span className={styles.date}>
                    {getPatientDate(appointment)}
                  </span>
                  <span className={styles.time}>
                    {getPatientTime(appointment)}
                  </span>
                </p>
              </div>
            </div>
            <div className={styles.appointmentActions}>
              {appointmentTab === "pending" && (
                <>
                  <button
                    className={styles.acceptButton}
                    onClick={() =>
                      handleAppointmentAction(
                        appointment._id,
                        "pending",
                        "accept"
                      )
                    }
                  >
                    <Check size={20} />
                  </button>
                  <button
                    className={styles.declineButton}
                    onClick={() =>
                      handleAppointmentAction(
                        appointment._id,
                        "pending",
                        "decline"
                      )
                    }
                  >
                    <X size={20} />
                  </button>
                </>
              )}
              {appointmentTab === "upcoming" && (
                <button
                  className={styles.completeButton}
                  onClick={() =>
                    handleAppointmentAction(
                      appointment._id,
                      "upcoming",
                      "complete"
                    )
                  }
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className={styles.contentArea}>
      <button
        className={styles.addButton}
        onClick={() => setShowPrescriptionModal(true)}
      >
        <Plus size={20} /> New Prescription
      </button>

      {showPrescriptionModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>New Prescription</h2>
              <button onClick={() => setShowPrescriptionModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPrescription}>
              <div className={styles.formGroup}>
                <label>Select Patient</label>
                <select
                  value={newPrescription.patientId}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      patientId: e.target.value,
                    })
                  }
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {getPatientName(patient)}
                    </option>
                  ))}
                </select>
              </div>

              {newPrescription.medications.map((med, index) => (
                <div key={index} className={styles.medicationFields}>
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={med.name}
                    onChange={(e) => {
                      const newMeds = [...newPrescription.medications];
                      newMeds[index].name = e.target.value;
                      setNewPrescription({
                        ...newPrescription,
                        medications: newMeds,
                      });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => {
                      const newMeds = [...newPrescription.medications];
                      newMeds[index].dosage = e.target.value;
                      setNewPrescription({
                        ...newPrescription,
                        medications: newMeds,
                      });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => {
                      const newMeds = [...newPrescription.medications];
                      newMeds[index].duration = e.target.value;
                      setNewPrescription({
                        ...newPrescription,
                        medications: newMeds,
                      });
                    }}
                  />
                </div>
              ))}

              <button
                type="button"
                className={styles.addMedicationButton}
                onClick={() =>
                  setNewPrescription({
                    ...newPrescription,
                    medications: [
                      ...newPrescription.medications,
                      { name: "", dosage: "", duration: "" },
                    ],
                  })
                }
              >
                <Plus size={20} /> Add Medication
              </button>

              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  value={newPrescription.notes}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add any additional notes or remarks"
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Create Prescription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.dashboard}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏥</span>
          <span>Care</span>
        </div>
        <div className={styles.navLinks}>
          <button
            className={`${styles.navLink} ${
              activeTab === "patients" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("patients")}
          >
            <Users size={20} />
            <span>Patients</span>
          </button>
          <button
            className={`${styles.navLink} ${
              activeTab === "appointments" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            <Calendar size={20} />
            <span>Appointments</span>
          </button>
          <button
            className={`${styles.navLink} ${
              activeTab === "prescriptions" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("prescriptions")}
          >
            <FileText size={20} />
            <span>Prescriptions</span>
          </button>
        </div>
        <div className={styles.userProfile}>
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50"
            alt="Doctor"
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <h4>Dr. Michael Shaw</h4>
            <p>Cardiologist</p>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconButton}>
              <Bell size={20} />
              <span className={styles.notificationBadge}>2</span>
            </button>
            <button className={styles.iconButton}>
              <Settings size={20} />
            </button>
            <button className={styles.iconButton}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {activeTab === "patients" && renderPatientsList()}
        {activeTab === "appointments" && renderAppointments()}
        {activeTab === "prescriptions" && renderPrescriptions()}

        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <Check size={20} />
            <span>Action completed successfully!</span>
          </div>
        )}
      </main>
    </div>
  );

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <nav className={styles.sidebar}>
        {/* ... Same sidebar content as original ... */}
      </nav>

      <main className={styles.main}>
        <header className={styles.header}>
          {/* ... Same header content as original ... */}
        </header>

        {activeTab === "patients" && renderPatientsList()}
        {activeTab === "appointments" && renderAppointments()}
        {activeTab === "prescriptions" && renderPrescriptions()}

        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <Check size={20} />
            <span>Action completed successfully!</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default DoctorDashboard;
