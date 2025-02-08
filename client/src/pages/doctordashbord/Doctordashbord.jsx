import React, { useState } from 'react';
import { Search, Users, Calendar, FileText, Bell, Settings, LogOut, X, Check, Plus, ChevronRight } from 'lucide-react';
import styles from "./Doctordashboard.module.css";

// Mock data for initial state
const initialPatients = [
  {
    id: 1,
    name: 'Ralph Edwards',
    age: 35,
    gender: 'Male',
    phone: '+1 212 456 7890',
    email: 'ralphed@gmail.com',
    reason: 'Wrist Fracture Surgery',
    date: 'Tue, 19 Mar 2024',
    time: '3:00 PM',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150',
    status: 'Current',
    vitals: {
      bloodPressure: '132/87 mmHg',
      temperature: '100.4 °F',
      oxygenSaturation: '96%',
      weight: '74 kg',
      heartRate: '82.79 bpm',
      height: '5.10 inch'
    },
    emergency: {
      name: 'Gia Edwards',
      relation: 'Spouse',
      phone: '+1 212 456 2345'
    }
  },
  {
    id: 2,
    name: 'John Smith',
    age: 37,
    gender: 'Male',
    reason: 'Hypertension and Asthma',
    date: 'Mon, 18 Mar 2024',
    time: '2:00 PM',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150',
    status: 'Current'
  },
  {
    id: 3,
    name: 'Robert Brown',
    age: 87,
    gender: 'Male',
    reason: 'Diagnosis Test for Diabetes Type 2',
    date: 'Sat, 16 Mar 2024',
    time: '11:00 AM',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
    status: 'New'
  },
  {
    id: 4,
    name: 'Mary Jones',
    age: 40,
    gender: 'Female',
    reason: 'Kidney Stone',
    date: 'Fri, 15 Mar 2024',
    time: '7:00 PM',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    status: 'Current'
  },
  {
    id: 5,
    name: 'William Taylor',
    age: 28,
    gender: 'Male',
    reason: 'Hand Fracture',
    date: 'Mon, 11 Mar 2024',
    time: '8:00 PM',
    image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150',
    status: 'Discharged'
  }
];

const initialAppointments = {
  pending: [
    {
      id: 1,
      patientName: 'John Smith',
      reason: 'Hypertension and Asthma',
      date: 'Mon, 18 Mar 2024',
      time: '2:00 PM',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150'
    },
    {
      id: 2,
      patientName: 'Sarah Wilson',
      reason: 'Annual Checkup',
      date: 'Wed, 20 Mar 2024',
      time: '10:00 AM',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    }
  ],
  upcoming: [
    {
      id: 3,
      patientName: 'Robert Brown',
      reason: 'Diabetes Follow-up',
      date: 'Thu, 21 Mar 2024',
      time: '3:30 PM',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150'
    },
    {
      id: 4,
      patientName: 'Emily Davis',
      reason: 'Blood Pressure Check',
      date: 'Fri, 22 Mar 2024',
      time: '11:00 AM',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    }
  ],
  completed: [
    {
      id: 5,
      patientName: 'William Taylor',
      reason: 'Post-surgery Review',
      date: 'Mon, 11 Mar 2024',
      time: '9:00 AM',
      image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150'
    }
  ]
};

const DoctorDashboard=()=> {
  const [activeTab, setActiveTab] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [patients, setPatients] = useState(initialPatients);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activePatientFilter, setActivePatientFilter] = useState('All Patients');
  const [appointmentTab, setAppointmentTab] = useState('pending');
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    medications: [{ name: '', dosage: '', duration: '' }],
    notes: ''
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm) ||
                         patient.reason.toLowerCase().includes(searchTerm);
    if (activePatientFilter === 'All Patients') return matchesSearch;
    return matchesSearch && patient.status === activePatientFilter;
  });

  const handleAppointmentAction = (appointmentId, type, action) => {
    setAppointments(prev => {
      const appointment = prev[type].find(app => app.id === appointmentId);
      const newAppointments = {
        ...prev,
        [type]: prev[type].filter(app => app.id !== appointmentId)
      };
      
      if (action === 'accept') {
        newAppointments.upcoming = [...newAppointments.upcoming, appointment];
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else if (action === 'complete') {
        newAppointments.completed = [...newAppointments.completed, appointment];
      }
      
      return newAppointments;
    });
  };

  const handleAddPrescription = (e) => {
    e.preventDefault();
    setShowPrescriptionModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const renderPatientsList = () => (
    <div className={styles.contentArea}>
      <div className={styles.patientFilters}>
        <button
          className={`${styles.filterButton} ${activePatientFilter === 'All Patients' ? styles.active : ''}`}
          onClick={() => setActivePatientFilter('All Patients')}
        >
          All Patients <span>120</span>
        </button>
        <button
          className={`${styles.filterButton} ${activePatientFilter === 'Current' ? styles.active : ''}`}
          onClick={() => setActivePatientFilter('Current')}
        >
          Current Patients <span>80</span>
        </button>
        <button
          className={`${styles.filterButton} ${activePatientFilter === 'New' ? styles.active : ''}`}
          onClick={() => setActivePatientFilter('New')}
        >
          New Patients <span>20</span>
        </button>
        <button
          className={`${styles.filterButton} ${activePatientFilter === 'Discharged' ? styles.active : ''}`}
          onClick={() => setActivePatientFilter('Discharged')}
        >
          Discharged Patients <span>40</span>
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
          <div>Schedule Time & Date</div>
        </div>
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            className={styles.patientRow}
            onClick={() => setSelectedPatient(patient)}
          >
            <div className={styles.checkbox}>
              <input type="checkbox" />
            </div>
            <div className={styles.patientInfo}>
              <img src={patient.image} alt={patient.name} className={styles.patientImage} />
              <div>
                <h3>{patient.name}</h3>
                <p>{patient.age} Y, {patient.gender}</p>
              </div>
            </div>
            <div className={styles.reason}>{patient.reason}</div>
            <div className={styles.schedule}>
              <div>{patient.date}</div>
              <div>{patient.time}</div>
            </div>
          </div>
        ))}
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
              <img src={selectedPatient.image} alt={selectedPatient.name} />
              <div className={styles.patientContact}>
                <h3>{selectedPatient.name}</h3>
                <p>{selectedPatient.age} Y, {selectedPatient.gender}</p>
                <div className={styles.contactInfo}>
                  <div>
                    <span className={styles.icon}>📞</span>
                    {selectedPatient.phone}
                  </div>
                  <div>
                    <span className={styles.icon}>✉️</span>
                    {selectedPatient.email}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.visitInfo}>
              <h4>Visit Info</h4>
              <div className={styles.visitDetails}>
                <div>
                  <span>Scheduled Time & Date</span>
                  <p>{selectedPatient.date}, {selectedPatient.time}</p>
                </div>
                <div>
                  <span>Reason</span>
                  <p>{selectedPatient.reason}</p>
                </div>
              </div>
            </div>

            <div className={styles.vitalsGrid}>
              {Object.entries(selectedPatient.vitals).map(([key, value]) => (
                <div key={key} className={styles.vitalCard}>
                  <h4>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <p>{value}</p>
                </div>
              ))}
            </div>

            <div className={styles.emergencyContact}>
              <h4>Emergency Contact</h4>
              <div className={styles.emergencyInfo}>
                <div className={styles.contactPerson}>
                  <span>{selectedPatient.emergency.name}</span>
                  <p>{selectedPatient.emergency.relation}</p>
                </div>
                <button className={styles.callButton}>
                  <span className={styles.icon}>📞</span>
                  {selectedPatient.emergency.phone}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className={styles.contentArea}>
      <div className={styles.appointmentsTabs}>
        <button
          className={`${styles.tabButton} ${appointmentTab === 'pending' ? styles.active : ''}`}
          onClick={() => setAppointmentTab('pending')}
        >
          Pending ({appointments.pending.length})
        </button>
        <button
          className={`${styles.tabButton} ${appointmentTab === 'upcoming' ? styles.active : ''}`}
          onClick={() => setAppointmentTab('upcoming')}
        >
          Upcoming ({appointments.upcoming.length})
        </button>
        <button
          className={`${styles.tabButton} ${appointmentTab === 'completed' ? styles.active : ''}`}
          onClick={() => setAppointmentTab('completed')}
        >
          Completed ({appointments.completed.length})
        </button>
      </div>

      <div className={styles.appointmentsList}>
        {appointments[appointmentTab]?.map(appointment => (
          <div key={appointment.id} className={styles.appointmentCard}>
            <div className={styles.appointmentInfo}>
              <img src={appointment.image} alt={appointment.patientName} className={styles.patientImage} />
              <div>
                <h3>{appointment.patientName}</h3>
                <p className={styles.reason}>{appointment.reason}</p>
                <p className={styles.datetime}>
                  <span className={styles.date}>{appointment.date}</span>
                  <span className={styles.time}>{appointment.time}</span>
                </p>
              </div>
            </div>
            {appointmentTab === 'pending' && (
              <div className={styles.appointmentActions}>
                <button
                  className={styles.acceptButton}
                  onClick={() => handleAppointmentAction(appointment.id, 'pending', 'accept')}
                >
                  <Check size={20} />
                </button>
                <button
                  className={styles.declineButton}
                  onClick={() => handleAppointmentAction(appointment.id, 'pending', 'decline')}
                >
                  <X size={20} />
                </button>
              </div>
            )}
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
                  onChange={(e) => setNewPrescription({
                    ...newPrescription,
                    patientId: e.target.value
                  })}
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
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
                        medications: newMeds
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
                        medications: newMeds
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
                        medications: newMeds
                      });
                    }}
                  />
                </div>
              ))}

              <button
                type="button"
                className={styles.addMedicationButton}
                onClick={() => setNewPrescription({
                  ...newPrescription,
                  medications: [...newPrescription.medications, { name: '', dosage: '', duration: '' }]
                })}
              >
                <Plus size={20} /> Add Medication
              </button>

              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  value={newPrescription.notes}
                  onChange={(e) => setNewPrescription({
                    ...newPrescription,
                    notes: e.target.value
                  })}
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
            className={`${styles.navLink} ${activeTab === 'patients' ? styles.active : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <Users size={20} />
            <span>Patients</span>
          </button>
          <button
            className={`${styles.navLink} ${activeTab === 'appointments' ? styles.active : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={20} />
            <span>Appointments</span>
          </button>
          <button
            className={`${styles.navLink} ${activeTab === 'prescriptions' ? styles.active : ''}`}
            onClick={() => setActiveTab('prescriptions')}
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

        {activeTab === 'patients' && renderPatientsList()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'prescriptions' && renderPrescriptions()}

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