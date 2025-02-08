import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Video, Phone, MapPin } from "lucide-react";
import styles from "./PatientAppointmentHistory.module.css";

const PatientAppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/appointment/history",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const getModeIcon = (mode) => {
    switch (mode) {
      case "video":
        return <Video className={styles.icon} />;
      case "phone":
        return <Phone className={styles.icon} />;
      default:
        return <MapPin className={styles.icon} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>My Appointments</h1>
        </div>
        {appointments.length === 0 ? (
          <div className={styles.noAppointments}>No appointments yet</div>
        ) : (
          <div className={styles.appointmentGrid}>
            {appointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.doctorName}>
                    {appointment.doctorName}
                  </h3>
                  <p className={styles.department}>{appointment.department}</p>
                </div>
                <div className={styles.appointmentDetails}>
                  <div className={styles.detailItem}>
                    <Calendar className={styles.icon} /> {appointment.date}
                  </div>
                  <div className={styles.detailItem}>
                    <Clock className={styles.icon} /> {appointment.time}
                  </div>
                  <div className={styles.detailItem}>
                    {getModeIcon(appointment.mode)} {appointment.mode}{" "}
                    Consultation
                  </div>
                  <div className={styles.detailItem}>
                    <MapPin className={styles.icon} /> {appointment.location}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionButton}>Reschedule</button>
                  <button className={styles.cancelButton}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointmentHistory;
