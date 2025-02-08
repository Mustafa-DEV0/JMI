import React, { useState } from 'react';
import { Search, Users, UserCheck, Building2, Clock, AlertCircle, Trash2, CheckCircle } from 'lucide-react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingView, setPendingView] = useState('doctors');

  // Dummy data - replace with actual data from backend
  const [stats, setStats] = useState({
    totalPatients: 1234,
    verifiedDoctors: 89,
    medicalStores: 56,
    pendingVerifications: 12
  });

  const [recentActivity] = useState([
    { id: 1, action: 'New patient registered', time: '2 minutes ago' },
    { id: 2, action: 'Doctor verification approved', time: '5 minutes ago' },
    { id: 3, action: 'Medical store added', time: '10 minutes ago' }
  ]);

  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', age: 35, condition: 'Regular Checkup', lastVisit: '2024-02-20' },
    { id: 2, name: 'Jane Smith', age: 28, condition: 'Fever', lastVisit: '2024-02-19' }
  ]);

  const [verifiedDoctors, setVerifiedDoctors] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiologist', experience: '15 years' },
    { id: 2, name: 'Dr. Michael Brown', specialization: 'Pediatrician', experience: '10 years' }
  ]);

  const [pendingDoctors, setPendingDoctors] = useState([
    { id: 1, name: 'Dr. Emily Wilson', specialization: 'Neurologist', experience: '8 years' },
    { id: 2, name: 'Dr. Robert Clark', specialization: 'Dermatologist', experience: '12 years' }
  ]);

  const [medicalStores, setMedicalStores] = useState([
    { id: 1, name: 'HealthCare Pharmacy', location: 'Downtown', license: 'HC123456' },
    { id: 2, name: 'MediCare Store', location: 'Uptown', license: 'MC789012' }
  ]);

  const [pendingStores, setPendingStores] = useState([
    { id: 1, name: 'City Pharmacy', location: 'Westside', license: 'CP345678' },
    { id: 2, name: 'Quick Meds', location: 'Eastside', license: 'QM901234' }
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeletePatient = (id) => {
    setPatients(patients.filter(patient => patient.id !== id));
    // Add backend integration here
  };

  const handleDeleteDoctor = (id) => {
    setVerifiedDoctors(verifiedDoctors.filter(doctor => doctor.id !== id));
    // Add backend integration here
  };

  const handleDeleteStore = (id) => {
    setMedicalStores(medicalStores.filter(store => store.id !== id));
    // Add backend integration here
  };

  const handleVerifyDoctor = (doctor) => {
    setPendingDoctors(pendingDoctors.filter(d => d.id !== doctor.id));
    setVerifiedDoctors([...verifiedDoctors, doctor]);
    setStats(prev => ({
      ...prev,
      verifiedDoctors: prev.verifiedDoctors + 1,
      pendingVerifications: prev.pendingVerifications - 1
    }));
    // Add backend integration here
  };

  const handleVerifyStore = (store) => {
    setPendingStores(pendingStores.filter(s => s.id !== store.id));
    setMedicalStores([...medicalStores, store]);
    setStats(prev => ({
      ...prev,
      medicalStores: prev.medicalStores + 1,
      pendingVerifications: prev.pendingVerifications - 1
    }));
    // Add backend integration here
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
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
            <div className={styles.activitySection}>
              <h3>Recent Activity</h3>
              <div className={styles.activityList}>
                {recentActivity.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityContent}>
                      <Clock className={styles.activityIcon} />
                      <span>{activity.action}</span>
                    </div>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Condition</th>
                  <th>Last Visit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients
                  .filter(patient => 
                    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.condition}</td>
                      <td>{patient.lastVisit}</td>
                      <td>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
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

      case 'doctors':
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {verifiedDoctors
                  .filter(doctor =>
                    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.experience}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteDoctor(doctor.id)}
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

      case 'stores':
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>License</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicalStores
                  .filter(store =>
                    store.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((store) => (
                    <tr key={store.id}>
                      <td>{store.name}</td>
                      <td>{store.location}</td>
                      <td>{store.license}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteStore(store.id)}
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

      case 'pending':
        return (
          <div className={styles.pendingSection}>
            <div className={styles.pendingTabs}>
              <button
                className={`${styles.pendingTab} ${pendingView === 'doctors' ? styles.activeTab : ''}`}
                onClick={() => setPendingView('doctors')}
              >
                Pending Doctors
              </button>
              <button
                className={`${styles.pendingTab} ${pendingView === 'stores' ? styles.activeTab : ''}`}
                onClick={() => setPendingView('stores')}
              >
                Pending Stores
              </button>
            </div>
            <div className={styles.tableWrapper}>
              {pendingView === 'doctors' ? (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDoctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>{doctor.name}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.experience}</td>
                        <td className={styles.actionButtons}>
                          <button
                            onClick={() => handleVerifyDoctor(doctor)}
                            className={styles.verifyButton}
                          >
                            <CheckCircle />
                          </button>
                          <button
                            onClick={() => setPendingDoctors(pendingDoctors.filter(d => d.id !== doctor.id))}
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
                      <th>Location</th>
                      <th>License</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingStores.map((store) => (
                      <tr key={store.id}>
                        <td>{store.name}</td>
                        <td>{store.location}</td>
                        <td>{store.license}</td>
                        <td className={styles.actionButtons}>
                          <button
                            onClick={() => handleVerifyStore(store)}
                            className={styles.verifyButton}
                          >
                            <CheckCircle />
                          </button>
                          <button
                            onClick={() => setPendingStores(pendingStores.filter(s => s.id !== store.id))}
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

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className={styles.searchIcon} />
        </div>
        <nav className={styles.navigation}>
          <button
            className={`${styles.navButton} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'patients' ? styles.active : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            Patients
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'doctors' ? styles.active : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Verified Doctors
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'stores' ? styles.active : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            Medical Stores
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Verifications
          </button>
        </nav>
      </div>
      <main className={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;