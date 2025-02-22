import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Activity,
  Clock,
  Edit,
  AlertCircle,
  Pill as Pills,
  FileText,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import styles from "./Dashboard.module.css";
import API from "../../api/axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [uploadingReports, setUploadingReports] = useState(false);

  const [patientData, setPatientData] = useState({
    patient: {
      personalDetails: {
        address: {
          city: "",
          state: "",
          pincode: "",
        },
        emergencyContact: {
          name: "",
          phone: "",
          relation: "",
        },
        name: "",
        phone: "",
        dob: "",
        age: null,
        gender: "",
      },
      medicalDetails: {
        bloodGroup: "",
        height: null,
        weight: null,
        allergies: [],
        diseases: [],
        currentMedication: [],
      },
      _id: "",
      email: "",
      password: "",
      isAdmin: false,
      reports: [],
      createdAt: "",
      updatedAt: "",
    },
    orders: [],
    upcomingAppointments: [],
  });
  clearInterval;

  const { id } = useParams();
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get( `http://localhost:5000/patient/dashboard/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  const calculateTimeRemaining = (date, time) => {
    const appointmentDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = appointmentDate - now;

    if (diff < 0) return "Past";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h remaining`;
  };

  const handleUpdateProfile = () => {
    alert("Update Profile Not yet Implemented");
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      try {
        setUploadingReports(true);

        // Create previews for all selected files
        const newPreviews = files.map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
        }));

        setPreviews((prev) => [...prev, ...newPreviews]);

        // Upload all files
        await Promise.all(files.map((file) => onUploadReport(file)));

        // Clean up previews after successful upload
        newPreviews.forEach((preview) =>
          URL.revokeObjectURL(preview.previewUrl)
        );
        setPreviews([]);
      } catch (error) {
        console.error("Error uploading reports:", error);
      } finally {
        setUploadingReports(false);
        // Reset file input
        fileInputRef.current.value = "";
      }
    }
  };

  const cancelUpload = (previewId) => {
    setPreviews((prev) => {
      const previewToRemove = prev.find((p) => p.id === previewId);
      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove.previewUrl);
      }
      return prev.filter((p) => p.id !== previewId);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>
          Welcome <span>{patientData.patient.personalDetails.name}</span>
        </h1>
        <button className={styles.updateButton} onClick={handleUpdateProfile}>
          <Edit size={20} />
          Update Profile
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "personal" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Details
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "medical" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("medical")}
            >
              Medical Information
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "reports" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "orders" ? styles.active : ""
              } ${
                !(patientData.orders && patientData.orders.length)
                  ? styles.disabled
                  : ""
              }`}
              onClick={() => {
                if (patientData.orders && patientData.orders.length) {
                  setActiveTab("orders");
                }
              }}
              disabled={!(patientData.orders && patientData.orders.length)}
            >
              Orders
            </button>
          </div>

          {activeTab === "personal" && (
            <div className={styles.detailsCard}>
              <div className={styles.personalInfo}>
                <div className={styles.infoGroup}>
                  <User className={styles.icon} />
                  <div>
                    <h3>Name</h3>
                    <p>{patientData.patient.personalDetails.name}</p>
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <Phone className={styles.icon} />
                  <div>
                    <h3>Phone</h3>
                    <p>{patientData.patient.personalDetails.phone}</p>
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <Calendar className={styles.icon} />
                  <div>
                    <h3>Date of Birth</h3>
                    <p>
                      {patientData?.patient.personalDetails?.dob
                        ? new Date(
                            patientData.patient.personalDetails.dob
                          ).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <MapPin className={styles.icon} />
                  <div>
                    <h3>Address</h3>
                    <p>
                      {patientData.patient.personalDetails?.address
                        ? `${patientData.patient.personalDetails.address.city}, ${patientData.patient.personalDetails.address.state} - ${patientData.patient.personalDetails.address.pincode}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.emergencyContact}>
                <h3>
                  <AlertCircle className={styles.icon} /> Emergency Contact
                </h3>
                <div className={styles.emergencyInfo}>
                  <p>
                    <strong>Name:</strong>{" "}
                    {patientData?.patient.personalDetails?.emergencyContact
                      ?.name || "Not provided"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {patientData?.patient.personalDetails?.emergencyContact
                      ?.phone || "Not provided"}
                  </p>
                  <p>
                    <strong>Relation:</strong>{" "}
                    {patientData?.patient.personalDetails?.emergencyContact
                      ?.relation || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "medical" && (
            <div className={styles.detailsCard}>
              <div className={styles.medicalInfo}>
                <div className={styles.infoGroup}>
                  <Heart className={styles.icon} />
                  <div>
                    <h3>Blood Group</h3>
                    <p>
                      {patientData?.patient.medicalDetails?.bloodGroup ||
                        "Not provided"}
                    </p>
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <Activity className={styles.icon} />
                  <div>
                    <h3>Physical Details</h3>
                    <p>
                      Height:{" "}
                      {patientData?.patient.medicalDetails?.height || "N/A"} cm
                    </p>
                    <p>
                      Weight:{" "}
                      {patientData?.patient.medicalDetails?.weight || "N/A"} kg
                    </p>
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <AlertCircle className={styles.icon} />
                  <div>
                    <h3>Allergies</h3>
                    <div className={styles.tagList}>
                      {patientData?.patient.medicalDetails?.allergies?.map(
                        (allergy, index) => (
                          <span key={index} className={styles.tag}>
                            {allergy}
                          </span>
                        )
                      ) || "None reported"}
                    </div>
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <FileText className={styles.icon} />
                  <div>
                    <h3>Diseases</h3>
                    <div className={styles.tagList}>
                      {patientData?.patient.medicalDetails?.diseases?.map(
                        (disease, index) => (
                          <span key={index} className={styles.tag}>
                            {disease}
                          </span>
                        )
                      ) || "None reported"}
                    </div>
                  </div>
                </div>

                <div className={styles.medicationSection}>
                  <h3>
                    <Pills className={styles.icon} /> Current Medication
                  </h3>
                  <div className={styles.medicationList}>
                    {patientData.patient.medicalDetails.currentMedication
                      .length > 0 ? (
                      patientData.patient.medicalDetails.currentMedication.map(
                        (med, index) => (
                          <div key={index} className={styles.medicationItem}>
                            <h4>{med.name || med.tabletName}</h4>
                            <p>
                              Dosage: <span>{med.dosage}</span>
                            </p>
                            <p>
                              Duration: <span>{med.duration}</span>
                            </p>
                            {med.timing && (
                              <p>
                                Timing: <span>{med.timing}</span>
                              </p>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div className={styles.medicationItem}>
                        <p>No current medications</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className={styles.detailsCard}>
              <div className={styles.reportsSection}>
                <div className={styles.reportsHeader}>
                  <h3>
                    <ImageIcon className={styles.icon} /> Medical Reports
                  </h3>
                  <button
                    className={`${styles.uploadButton} ${
                      uploadingReports ? styles.uploading : ""
                    }`}
                    onClick={triggerFileInput}
                    disabled={uploadingReports}
                  >
                    <Upload size={20} />
                    {uploadingReports ? "Uploading..." : "Upload Reports"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className={styles.hiddenInput}
                  />
                </div>

                {previews.length > 0 && (
                  <div className={styles.previewsContainer}>
                    <div className={styles.previewHeader}>
                      <h4>Previews</h4>
                    </div>
                    <div className={styles.previewsGrid}>
                      {previews.map((preview) => (
                        <div key={preview.id} className={styles.previewCard}>
                          <button
                            className={styles.cancelButton}
                            onClick={() => cancelUpload(preview.id)}
                          >
                            <X size={20} />
                          </button>
                          <img
                            src={preview.previewUrl}
                            alt="Report Preview"
                            className={styles.previewImage}
                          />
                          <p className={styles.fileName}>{preview.file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.reportsGrid}>
                  {patientData?.reports?.map((report, index) => (
                    <div key={report.id || index} className={styles.reportCard}>
                      <div className={styles.reportImageContainer}>
                        <img
                          src={report.url}
                          alt={`Medical Report ${index + 1}`}
                          className={styles.reportImage}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.reportInfo}>
                        <p className={styles.reportDate}>
                          {new Date(report.uploadDate).toLocaleDateString()}
                        </p>
                        <div className={styles.reportActions}>
                          <a
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewButton}
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {patientData?.reports?.length === 0 && !previews.length && (
                  <div className={styles.noReports}>
                    <ImageIcon size={48} className={styles.noReportsIcon} />
                    <p>No reports uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className={styles.detailsCard}>
              <div className={styles.ordersSection}>
                <div className={styles.orderCategory}>
                  <h3>
                    <Package className={styles.icon} /> Upcoming Orders
                  </h3>

                  <div className={styles.ordersList}>
                    {medicineOrders.upcoming.map((order) => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div>
                            <h4>{order.medicalName}</h4>
                            <p className={styles.orderDate}>
                              Ordered on{" "}
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`${styles.orderStatus} ${
                              styles[order.status]
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className={styles.orderItems}>
                          {order.items.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                              <p>
                                {item.name} x {item.quantity}
                              </p>
                              <p>₹{item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                        <div className={styles.orderTotal}>
                          <p>Total Amount</p>
                          <p>₹{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.orderCategory}>
                  <h3>
                    <ShoppingBag className={styles.icon} /> Previous Orders
                  </h3>
                  <div className={styles.ordersList}>
                    {medicineOrders.previous.map((order) => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div>
                            <h4>{order.medicalName}</h4>
                            <p className={styles.orderDate}>
                              Delivered on{" "}
                              {new Date(
                                order.deliveryDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`${styles.orderStatus} ${
                              styles[order.status]
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className={styles.orderItems}>
                          {order.items.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                              <p>
                                {item.name} x {item.quantity}
                              </p>
                              <p>₹{item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                        <div className={styles.orderTotal}>
                          <p>Total Amount</p>
                          <p>₹{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.appointmentsSection}>
          <h2>Upcoming Appointments</h2>
          {patientData.upcomingAppointments ? (
            <>
              <div className={styles.appointmentsList}>
                {patientData.upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className={styles.appointmentCard}>
                    <div className={styles.appointmentHeader}>
                      <h3>{appointment.doctorName}</h3>
                      <span className={styles[appointment.status]}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className={styles.specialization}>
                      {appointment.specialization}
                    </p>
                    <div className={styles.appointmentTime}>
                      <Clock className={styles.icon} />
                      <span>
                        {new Date(
                          `${appointment.date}T${appointment.time}`
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.timeRemaining}>
                      {calculateTimeRemaining(
                        appointment.date,
                        appointment.time
                      )}
                    </div>
                    <button className={styles.viewDetails}>
                      View Details <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
