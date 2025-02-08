import React from 'react';
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Contact, 
  Activity, 
  FileText, 
  AlertCircle,
  Pill,
  Ruler,
  Weight,
  Droplet,
  Mail,
  Clock,
  Edit3,
  ChevronRight,
  CalendarClock
} from 'lucide-react';
import styles from './UserDashboard.module.css';

const UserDashboard = ({ patient }) => {
  const dummyPatient = {
    personalDetails: {
      name: "John Doe",
      phone: "+1 234 567 8900",
      dob: new Date("1990-01-01"),
      age: 33,
      gender: "Male",
      address: {
        city: "New York",
        state: "NY",
        pincode: "10001"
      },
      emergencyContact: {
        name: "Jane Doe",
        phone: "+1 234 567 8901",
        relation: "Spouse"
      }
    },
    medicalDetails: {
      bloodGroup: "O+",
      height: 175,
      weight: 70,
      allergies: ["Peanuts", "Penicillin"],
      diseases: ["Hypertension"],
      currentMedication: [
        {
          tabletName: "Lisinopril",
          dosage: "10mg",
          duration: "Daily"
        }
      ]
    },
    appointments: [
      {
        doctor: "Dr. Daniel McAdams",
        department: "Cardiology",
        date: "2024-03-09",
        time: "09:15 AM",
        type: "Follow up",
        status: "Upcoming"
      },
      {
        doctor: "Dr. Michael Lee",
        department: "Endocrinology",
        date: "2024-03-15",
        time: "02:30 PM",
        type: "Consultation",
        status: "Scheduled"
      }
    ]
  };

  const data = patient || dummyPatient;

  const handleUpdateProfile = () => {
    // Navigate to update profile page
    console.log("Navigate to update profile");
  };

  const getTimeRemaining = (appointmentDate) => {
    const now = new Date();
    const appDate = new Date(appointmentDate);
    const diff = appDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return 'Less than an hour';
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Patient Dashboard</h1>
          <button onClick={handleUpdateProfile} className={styles.updateButton}>
            <Edit3 size={16} />
            Update Profile
          </button>
        </div>
        <div className={styles.patientCard}>
          <div className={styles.avatarContainer}>
            <User size={48} className={styles.avatarIcon} />
          </div>
          <div className={styles.patientInfo}>
            <h2>{data.personalDetails.name}</h2>
            <div className={styles.patientMeta}>
              <span><Mail size={14} /> patient@example.com</span>
              <span><Calendar size={14} /> {data.personalDetails.age} years</span>
              <span><Activity size={14} /> Active Patient</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Upcoming Appointments Card */}
        <section className={`${styles.card} ${styles.appointmentsCard}`}>
          <h3><CalendarClock /> Upcoming Appointments</h3>
          <div className={styles.cardContent}>
            <div className={styles.appointmentsList}>
              {data.appointments.map((appointment, index) => (
                <div key={index} className={styles.appointmentItem}>
                  <div className={styles.appointmentHeader}>
                    <div className={styles.doctorInfo}>
                      <h4>{appointment.doctor}</h4>
                      <span>{appointment.department}</span>
                    </div>
                    <span className={styles.appointmentType}>{appointment.type}</span>
                  </div>
                  <div className={styles.appointmentDetails}>
                    <div className={styles.appointmentTime}>
                      <Calendar size={16} />
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      <Clock size={16} />
                      <span>{appointment.time}</span>
                    </div>
                    <div className={styles.timeRemaining}>
                      <span>Time Remaining:</span>
                      <strong>{getTimeRemaining(`${appointment.date} ${appointment.time}`)}</strong>
                    </div>
                  </div>
                  <button className={styles.viewDetailsButton}>
                    View Details
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h3><User /> Personal Information</h3>
          <div className={styles.cardContent}>
            <div className={styles.infoItem}>
              <Phone size={20} />
              <span>{data.personalDetails.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <Calendar size={20} />
              <span>{new Date(data.personalDetails.dob).toLocaleDateString()}</span>
            </div>
            <div className={styles.infoItem}>
              <User size={20} />
              <span>{data.personalDetails.gender}</span>
            </div>
          </div>
        </section>

        {/* Rest of the existing cards... */}
        {/* ... */}
      </div>
    </div>
  );
};

export default UserDashboard;