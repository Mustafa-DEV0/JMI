import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Users,
  UserCheck,
  Building2,
  AlertCircle,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import styles from "./AdminDashboard.module.css";
import API from "../../api/axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingView, setPendingView] = useState("doctors");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalPatients: 0,
    verifiedDoctors: 0,
    medicalStores: 0,
    pendingVerifications: 0,
  });

  const [patients, setPatients] = useState([]);
  const [verifiedDoctors, setVerifiedDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [medicalStores, setMedicalStores] = useState([]);
  const [pendingStores, setPendingStores] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(API + "/dashboard/admin");
      const data = response.data;

      setStats(data.stats);
      setPatients(data.patients);
      setVerifiedDoctors(data.verifiedDoctors);
      setPendingDoctors(data.pendingDoctors);
      setMedicalStores(data.medicalStores);
      setPendingStores(data.pendingStores);
    } catch (error) {
      setError("Failed to fetch dashboard data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeletePatient = async (id) => {
    try {
      await axios.delete(API + `/dashboard/patient/${id}`);
      setPatients(patients.filter((patient) => patient._id !== id));
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await axios.delete(API + `/dashboard/doctor/${id}`);
      setVerifiedDoctors(verifiedDoctors.filter((doctor) => doctor._id !== id));
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await axios.delete(API + `/dashboard/store/${id}`);
      setMedicalStores(medicalStores.filter((store) => store._id !== id));
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  const handleVerifyDoctor = async (doctor) => {
    try {
      await axios.put(API + `/dashboard/doctor/verify/${doctor._id}`);
      setPendingDoctors(pendingDoctors.filter((d) => d._id !== doctor._id));
      setVerifiedDoctors([...verifiedDoctors, { ...doctor, isVerified: true }]);
      fetchDashboardData();
    } catch (error) {
      console.error("Error verifying doctor:", error);
    }
  };

  const handleVerifyStore = async (store) => {
    try {
      await axios.put(API + `/dashboard/store/verify/${store._id}`);
      setPendingStores(pendingStores.filter((s) => s._id !== store._id));
      setMedicalStores([...medicalStores, { ...store, isverified: true }]);
      fetchDashboardData();
    } catch (error) {
      console.error("Error verifying store:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "":
        return (
          <div className={styles.overviewGrid}>
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <Users className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <h3>Total Patients</h3>
                  <p>{stats.totalPatients}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <UserCheck className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <h3>Verified Doctors</h3>
                  <p>{stats.verifiedDoctors}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <Building2 className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <h3>Medical Stores</h3>
                  <p>{stats.medicalStores}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <AlertCircle className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <h3>Pending Verifications</h3>
                  <p>{stats.pendingVerifications}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "patients":
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients
                  .filter(
                    (patient) =>
                      patient.personalDetails?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      patient.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.personalDetails?.name || "N/A"}</td>
                      <td>{patient.email}</td>
                      <td>{patient.personalDetails?.phone || "N/A"}</td>
                      <td>{patient.personalDetails?.age || "N/A"}</td>
                      <td>
                        <button
                          onClick={() => handleDeletePatient(patient._id)}
                          className={styles.deleteButton}
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );

      case "doctors":
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {verifiedDoctors
                  .filter(
                    (doctor) =>
                      doctor.personalDetails?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      doctor.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((doctor) => (
                    <tr key={doctor._id}>
                      <td>{doctor.personalDetails?.name || "N/A"}</td>
                      <td>{doctor.email}</td>
                      <td>
                        {doctor.professionalDetails?.specialization || "N/A"}
                      </td>
                      <td>
                        {doctor.professionalDetails?.experience || "N/A"} years
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteDoctor(doctor._id)}
                          className={styles.deleteButton}
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );

      case "stores":
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>License Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicalStores
                  .filter(
                    (store) =>
                      store.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      store.owner
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((store) => (
                    <tr key={store._id}>
                      <td>{store.name}</td>
                      <td>{store.owner}</td>
                      <td>{`${store.address?.city || "N/A"}, ${
                        store.address?.state || ""
                      }`}</td>
                      <td>{store.licenseNumber}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteStore(store._id)}
                          className={styles.deleteButton}
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );

      case "pending":
        return (
          <div className={styles.pendingSection}>
            <div className={styles.pendingTabs}>
              <button
                className={`${styles.pendingTab} ${
                  pendingView === "doctors" ? styles.activeTab : ""
                }`}
                onClick={() => setPendingView("doctors")}
              >
                Pending Doctors
              </button>
              <button
                className={`${styles.pendingTab} ${
                  pendingView === "stores" ? styles.activeTab : ""
                }`}
                onClick={() => setPendingView("stores")}
              >
                Pending Stores
              </button>
            </div>
            <div className={styles.tableWrapper}>
              {pendingView === "doctors" ? (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDoctors
                      .filter(
                        (doctor) =>
                          doctor.personalDetails?.name
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          doctor.email
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      )
                      .map((doctor) => (
                        <tr key={doctor._id}>
                          <td>{doctor.personalDetails?.name || "N/A"}</td>
                          <td>{doctor.email}</td>
                          <td>
                            {doctor.professionalDetails?.specialization ||
                              "N/A"}
                          </td>
                          <td>
                            {doctor.professionalDetails?.experience || "N/A"}{" "}
                            years
                          </td>
                          <td className={styles.actionButtons}>
                            <button
                              onClick={() => handleVerifyDoctor(doctor)}
                              className={styles.verifyButton}
                            >
                              <CheckCircle />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doctor._id)}
                              className={styles.deleteButton}
                            >
                              <Trash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Owner</th>
                      <th>Location</th>
                      <th>License Number</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingStores
                      .filter(
                        (store) =>
                          store.name
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          store.owner
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      )
                      .map((store) => (
                        <tr key={store._id}>
                          <td>{store.name}</td>
                          <td>{store.owner}</td>
                          <td>{`${store.address?.city || "N/A"}, ${
                            store.address?.state || ""
                          }`}</td>
                          <td>{store.licenseNumber}</td>
                          <td className={styles.actionButtons}>
                            <button
                              onClick={() => handleVerifyStore(store)}
                              className={styles.verifyButton}
                            >
                              <CheckCircle />
                            </button>
                            <button
                              onClick={() => handleDeleteStore(store._id)}
                              className={styles.deleteButton}
                            >
                              <Trash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingSpinner} />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <p>{error}</p>
        <button onClick={fetchDashboardData} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className={styles.searchIcon} />
        </div>
        <nav className={styles.navigation}>
          <button
            className={`${styles.navButton} ${
              activeTab === "" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("")}
          >
            Overview
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "patients" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("patients")}
          >
            Patients
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "doctors" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("doctors")}
          >
            Verified Doctors
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "stores" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("stores")}
          >
            Medical Stores
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "pending" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Verifications
          </button>
        </nav>
      </div>
      <main className={styles.mainContent}>{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
