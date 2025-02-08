import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Video, Phone, Map, MapPin } from "lucide-react";
import styles from "./PatientAppointmentHistory.module.css";

const PatientAppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

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
        setFilteredAppointments(response.data); // Set default to all appointments
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [filter, appointments]);

  const getModeIcon = (mode) => {
    switch (mode) {
      case "video":
        return <Video className={styles.icon} />;
      case "phone":
        return <Phone className={styles.icon} />;
      default:
        return <Map className={styles.icon} />;
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];
    if (filter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === filter
      );
    }

    // Sort appointments so that Scheduled ones come first
    filtered.sort((a, b) => (a.status === "scheduled" ? -1 : 1));

    setFilteredAppointments(filtered);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.heading}>My Appointments</h1>
          <div className={styles.filterWrapper}>
            <span className={styles.filterIcon}>
              <MapPin /> {/* Added a filter icon */}
            </span>
            <select
              value={filter}
              onChange={handleFilterChange}
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
          <div className={styles.noAppointments}>No appointments yet</div>
        ) : (
          <div className={styles.appointmentGrid}>
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <h3>{appointment.doctorName}</h3>
                <p>{appointment.specialization.toUpperCase()}</p>
                <div>
                  <Calendar className={styles.icon} /> {appointment.date}
                </div>
                <div>
                  <Clock className={styles.icon} /> {appointment.time}
                </div>
                <div>
                  {getModeIcon(appointment.mode)} {appointment.mode}{" "}
                  Consultation
                </div>
                <div>
                  <MapPin className={styles.icon} /> {appointment.location}{" "}
                  {/* Changed to Location icon for location */}
                </div>
                <div
                  className={`${styles.statusBadge} ${
                    styles[appointment.status]
                  }`}
                >
                  {appointment.status} {/* Displaying status */}
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
