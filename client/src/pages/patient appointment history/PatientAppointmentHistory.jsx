import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Video, Phone, MapPin, Filter } from "lucide-react";
import styles from "./PatientAppointmentHistory.module.css";

const PatientAppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/appointment/history",
          {
            headers: { "Content-Type": "application/json" },
          },
          { token }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const filteredAppointments = appointments.filter((apt) =>
    filter === "all" ? true : apt.status === filter
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>My Appointments</h1>
          <div className={styles.filterWrapper} ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={styles.filterButton}
            >
              <Filter className={styles.filterIcon} />
              <span>
                Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </span>
            </button>
            {isFilterOpen && (
              <div className={styles.filterDropdown}>
                {["all", "upcoming", "completed", "pending", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilter(status);
                        setIsFilterOpen(false);
                      }}
                      className={`${styles.filterOption} ${
                        filter === status ? styles.active : ""
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
        {filteredAppointments.length === 0 ? (
          <div className={styles.noAppointments}>No appointments yet</div>
        ) : (
          <div className={styles.appointmentGrid}>
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <h3>{appointment.doctorName}</h3>
                <p>{appointment.department}</p>
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
                  <MapPin className={styles.icon} /> {appointment.location}
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
