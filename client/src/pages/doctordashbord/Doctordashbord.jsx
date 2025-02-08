import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import styles from './doctor-dashboard.module.css';

const initialAppointments = [
  {
    id: 1,
    patientName: 'Ralph Edwards',
    patientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    date: new Date(2024, 2, 20, 14, 30),
    reason: 'Wrist Fracture Surgery',
    status: 'pending',
  },
  {
    id: 2,
    patientName: 'John Smith',
    patientImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
    date: new Date(2024, 2, 18, 10, 0),
    reason: 'Hypertension Follow-up',
    status: 'completed',
  },
  {
    id: 3,
    patientName: 'Sarah Johnson',
    patientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    date: new Date(2024, 2, 25, 15, 30),
    reason: 'Annual Checkup',
    status: 'upcoming',
  },
  {
    id: 4,
    patientName: 'Michael Brown',
    patientImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    date: new Date(2024, 2, 19, 11, 0),
    reason: 'Diabetes Follow-up',
    status: 'pending',
  }
];

function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState('pending');

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    appointment.status === activeTab
  );

  // Handle appointment actions (accept/decline/remove)
  const handleAppointmentAction = (id, action) => {
    setAppointments(prevAppointments => {
      if (action === 'remove') {
        return prevAppointments.filter(appointment => appointment.id !== id);
      }

      return prevAppointments.map(appointment => {
        if (appointment.id === id) {
          return {
            ...appointment,
            status: action === 'accept' ? 'upcoming' : 'declined'
          };
        }
        return appointment;
      });
    });
  };

  // Get status color for appointments
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return styles.statusUpcoming;
      case 'completed':
        return styles.statusCompleted;
      case 'declined':
        return styles.statusDeclined;
      default:
        return styles.statusPending;
    }
  };

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.appointmentsView}>
          {/* Appointment tabs */}
          <div className={styles.tabs}>
            {['pending', 'upcoming', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Appointments list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.appointmentsList}
            >
              {filteredAppointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={styles.appointmentCard}
                >
                  <div className={styles.appointmentHeader}>
                    <img
                      src={appointment.patientImage}
                      alt={appointment.patientName}
                      className={styles.appointmentPatientImage}
                    />
                    <div>
                      <h3>{appointment.patientName}</h3>
                      <p>{format(appointment.date, 'MMM dd, yyyy • h:mm a')}</p>
                      <p className={styles.appointmentReason}>{appointment.reason}</p>
                    </div>
                  </div>

                  <div className={styles.appointmentActions}>
                    <span className={`${styles.status} ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    
                    {appointment.status === 'pending' && (
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'accept')}
                          className={styles.acceptButton}
                          title="Accept Appointment"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'decline')}
                          className={styles.declineButton}
                          title="Decline Appointment"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}

                    {appointment.status === 'upcoming' && (
                      <button
                        onClick={() => handleAppointmentAction(appointment.id, 'remove')}
                        className={styles.removeButton}
                        title="Remove Appointment"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredAppointments.length === 0 && (
                <div className={styles.noAppointments}>
                  No {activeTab} appointments found
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;