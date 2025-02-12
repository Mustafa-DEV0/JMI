import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Video, Phone, MapPin, Filter } from "lucide-react";
import styles from "./PatientAppointmentHistory.module.css";
import API from "../../api/axios";

const PatientAppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API + "/appointment/history", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filterAppointments = () => {
      let filtered = [...appointments];
      if (filter !== "all") {
        filtered = filtered.filter(
          (appointment) => appointment.status === filter
        );
      }
      // Prioritize scheduled appointments first when filter is "all"
      filtered.sort((a, b) => (a.status === "scheduled" ? -1 : 1));
      setFilteredAppointments(filtered);
    };

    filterAppointments();
  }, [filter, appointments]);

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
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Appointments</h1>
            <p className={styles.subtitle}>
              Manage your upcoming and past appointments
            </p>
          </div>
          <div className={styles.filterContainer}>
            <Filter className={styles.filterIcon} size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className={styles.emptyState}>
            <Calendar size={48} className={styles.emptyIcon} />
            <h2>No appointments found</h2>
            <p>When you schedule appointments, they will appear here</p>
          </div>
        ) : (
          <div className={styles.appointmentGrid}>
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.doctorInfo}>
                    <h3 className={styles.doctorName}>
                      {appointment.doctorName}
                    </h3>
                    <span className={styles.specialization}>
                      {appointment.specialization}
                    </span>
                  </div>
                  <div
                    className={`${styles.status} ${styles[appointment.status]}`}
                  >
                    {appointment.status}
                  </div>
                </div>

                <div className={styles.appointmentDetails}>
                  <div className={styles.detailItem}>
                    <Calendar className={styles.detailIcon} />
                    <span>{appointment.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Clock className={styles.detailIcon} />
                    <span>{appointment.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    {getModeIcon(appointment.mode)}
                    <span>{appointment.mode} Consultation</span>
                  </div>
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
