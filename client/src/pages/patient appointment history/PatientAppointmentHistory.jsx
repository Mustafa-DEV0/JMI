import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  Filter,
  Search,
} from "lucide-react";
import styles from "./PatientAppointmentHistory.module.css";

const MOCK_APPOINTMENTS = [
  {
    id: "APT001",
    doctorName: "Dr. Sarah Wilson",
    doctorId: "DOC123",
    date: "2024-03-25",
    time: "10:00 AM",
    status: "upcoming",
    mode: "video",
    department: "Cardiology",
    location: "Medical Center East",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
    rating: 4.8,
  },
  {
    id: "APT002",
    doctorName: "Dr. Michael Chen",
    doctorId: "DOC456",
    date: "2024-03-20",
    time: "2:30 PM",
    status: "completed",
    mode: "in-person",
    department: "Neurology",
    location: "Main Hospital Wing",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
    rating: 4.9,
  },
  {
    id: "APT003",
    doctorName: "Dr. Emily Brooks",
    doctorId: "DOC789",
    date: "2024-03-28",
    time: "11:15 AM",
    status: "pending",
    mode: "phone",
    department: "Dermatology",
    location: "Medical Plaza",
    avatar:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop",
    rating: 4.7,
  },
];

const PatientAppointmentHistory = () => {
  const [filter, setFilter] = useState("upcoming");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filterRef = useRef(null);

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

  const getRatingStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const filteredAppointments = MOCK_APPOINTMENTS.filter((apt) => {
    const matchesFilter = filter === "all" ? true : apt.status === filter;
    const matchesSearch =
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>My Appointments</h1>
            <p className={styles.subtitle}>
              Manage your upcoming medical consultations
            </p>
          </div>

          <div className={styles.headerControls}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by doctor or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

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
        </div>

        {filteredAppointments.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🔍</div>
            <h2>No appointments found</h2>
            <p>Try adjusting your filters or search terms</p>
            <button
              className={styles.resetButton}
              onClick={() => {
                setFilter("all");
                setSearchTerm("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.appointmentGrid}>
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`${styles.appointmentCard} ${
                  styles[appointment.status]
                }`}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.doctorInfo}>
                    <img
                      src={appointment.avatar}
                      alt={appointment.doctorName}
                      className={styles.doctorAvatar}
                    />
                    <div>
                      <h3>{appointment.doctorName}</h3>
                      <p>{appointment.department}</p>
                      <div className={styles.rating}>
                        <span className={styles.stars}>
                          {getRatingStars(appointment.rating)}
                        </span>
                        <span className={styles.ratingNumber}>
                          {appointment.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[appointment.status]
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>

                <div className={styles.appointmentDetails}>
                  <div className={styles.detailItem}>
                    <Calendar className={styles.icon} />
                    <span>
                      {new Date(
                        appointment.date + "T00:00:00"
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <Clock className={styles.icon} />
                    <span>{appointment.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <User className={styles.icon} />
                    <span>ID: {appointment.doctorId}</span>
                  </div>
                  <div className={styles.detailItem}>
                    {getModeIcon(appointment.mode)}
                    <span>
                      {appointment.mode.charAt(0).toUpperCase() +
                        appointment.mode.slice(1)}{" "}
                      Consultation
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <MapPin className={styles.icon} />
                    <span>{appointment.location}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.rescheduleButton}>
                    Reschedule
                    <span className={styles.buttonIcon}>→</span>
                  </button>
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
