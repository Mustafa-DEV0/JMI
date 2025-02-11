import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Phone, Clock, Calendar } from "lucide-react";
import styles from "./DoctorList.module.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    specialization: "all",
    experience: "all",
    feeRange: "all",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/doctor/list");
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to fetch doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...doctors];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          doctor.specialization
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    // Specialization filter
    if (filters.specialization !== "all") {
      filtered = filtered.filter(
        (doctor) =>
          doctor.specialization.toLowerCase() ===
          filters.specialization.toLowerCase()
      );
    }

    // Experience filter
    if (filters.experience !== "all") {
      const [min, max] = filters.experience.split("-").map(Number);
      filtered = filtered.filter((doctor) => {
        const exp = parseInt(doctor.experience);
        return exp >= min && (max ? exp <= max : true);
      });
    }

    // Fee range filter
    if (filters.feeRange !== "all") {
      const [min, max] = filters.feeRange.split("-").map(Number);
      filtered = filtered.filter((doctor) => {
        const fee = parseInt(doctor.consultationFee);
        return fee >= min && (max ? fee <= max : true);
      });
    }

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      specialization: "all",
      experience: "all",
      feeRange: "all",
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading doctors...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.appContainer}>
      <aside className={styles.filtersSidebar}>
        <div className={styles.filtersHeader}>
          <h2>Filters</h2>
          <button onClick={clearFilters} className={styles.clearFilters}>
            Clear All
          </button>
        </div>

        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search doctors..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterSection}>
          <h3>Specialization</h3>
          <select
            value={filters.specialization}
            onChange={(e) =>
              handleFilterChange("specialization", e.target.value)
            }
            className={styles.select}
          >
            <option value="all">All Specializations</option>
            <option value="ENT">ENT</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="ORTHODONTIST">Orthodontist</option>
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Experience</h3>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange("experience", e.target.value)}
            className={styles.select}
          >
            <option value="all">All Experience</option>
            <option value="0-5">0-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10">10+ years</option>
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Consultation Fee</h3>
          <select
            value={filters.feeRange}
            onChange={(e) => handleFilterChange("feeRange", e.target.value)}
            className={styles.select}
          >
            <option value="all">All Ranges</option>
            <option value="100-500">₹100 - ₹500</option>
            <option value="501-1000">₹501 - ₹1000</option>
            <option value="1001-1500">₹1001 - ₹1500</option>
            <option value="1501-2000">₹1501 - ₹2000</option>
          </select>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.doctorsGrid}>
          {filteredDoctors.length === 0 ? (
            <div className={styles.noResults}>
              <p>No doctors found matching your criteria.</p>
              <button onClick={clearFilters} className={styles.clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div key={doctor.id} className={styles.doctorCard}>
                <div className={styles.doctorHeader}>
                  <h3>{doctor.name}</h3>
                  <span className={styles.specialityTag}>
                    {doctor.specialization}
                  </span>
                </div>

                <p className={styles.qualifications}>{doctor.qualification}</p>
                <p className={styles.consultationFee}>
                  ₹{doctor.consultationFee} Consultation Fee
                </p>

                <div className={styles.doctorMeta}>
                  <div className={styles.metaItem}>
                    <Clock className={styles.icon} />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <div className={styles.metaItem}>
                    <MapPin className={styles.icon} />
                    <span>{doctor.clinicAddress}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar className={styles.icon} />
                    <span>Available: {doctor.availability.join(", ")}</span>
                  </div>
                </div>

                <div className={styles.doctorActions}>
                  <a
                    href={`tel:${doctor.phone}`}
                    className={styles.phoneButton}
                  >
                    <Phone className={styles.icon} />
                    Call Clinic
                  </a>
                  <button
                    className={styles.bookButton}
                    onClick={() => navigate(`/appointment/${doctor.id}`)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorList;
