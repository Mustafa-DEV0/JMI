import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Phone, Star, Clock, Calendar } from "lucide-react";
import styles from "./DoctorList.module.css";

const specializations = [
  "All",
  "Orthodontist",
  "Dentofacial Orthopedist",
  "Periodontist",
  "Endodontist",
];
const experienceRanges = ["All", "0-5 Years", "5-10 Years", "10+ Years"];
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function DoctorList() {
  const [filters, setFilters] = useState({
    gender: "all",
    specialization: "All",
    experience: "All",
    day: "All",
    search: "",
    priceRange: [0, 1000],
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [appliedFilters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      let queryParams = new URLSearchParams();

      if (appliedFilters.specialization !== "All")
        queryParams.append("specialization", appliedFilters.specialization);
      if (appliedFilters.experience !== "All")
        queryParams.append("experience", appliedFilters.experience);
      if (appliedFilters.day !== "All")
        queryParams.append("day", appliedFilters.day);
      if (appliedFilters.search.trim() !== "")
        queryParams.append("search", appliedFilters.search);
      queryParams.append("minFee", appliedFilters.priceRange[0]);
      queryParams.append("maxFee", appliedFilters.priceRange[1]);

      const url = `http://localhost:5000/doctorList?${queryParams}`;

      const response = await axios.get(url);

      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div>
          <h2 className={styles.filtersTitle}>Filters</h2>
        </div>

        <div className={styles.filterSection}>
          <h3>Specialization</h3>
          <select
            value={filters.specialization}
            onChange={(e) =>
              setFilters({ ...filters, specialization: e.target.value })
            }
            className={styles.select}
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Experience</h3>
          <select
            value={filters.experience}
            onChange={(e) =>
              setFilters({ ...filters, experience: e.target.value })
            }
            className={styles.select}
          >
            {experienceRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Availability</h3>
          <select
            value={filters.day}
            onChange={(e) => setFilters({ ...filters, day: e.target.value })}
            className={styles.select}
          >
            <option value="All">All Days</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Consultation Fee</h3>
          <div className={styles.priceRange}>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                })
              }
              className={styles.rangeSlider}
            />
            <div className={styles.priceLabels}>
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <button onClick={handleApplyFilters} className={styles.applyButton}>
          Apply Filters
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search doctors by name or specialization..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {loading ? (
          <p>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <div className={styles.doctorGrid}>
            {doctors.map((doctor, index) => (
              <div key={doctor.id || index} className={styles.doctorCard}>
                <div className={styles.doctorInfo}>
                  <img
                    src={doctor?.image}
                    alt={doctor.name}
                    className={styles.doctorImage}
                  />
                  <div className={styles.doctorDetails}>
                    <div className={styles.headerRow}>
                      <h3>{doctor?.name || "NA"}</h3>
                      <div className={styles.specialityTag}>
                        {doctor?.professionalDetails.specialization || "NA"}
                      </div>
                    </div>
                    <p className={styles.qualifications}>
                      {doctor?.professionalDetails.qualification || "NA"}
                    </p>
                    <p className={styles.consultationFee}>
                      &#8377;
                      {doctor?.professionalDetails.consultationFee || "NA"}{" "}
                      Consultation Fee
                    </p>

                    <div className={styles.metadata}>
                      <div className={styles.metaItem}>
                        <Star className={styles.icon} />
                        <span>{doctor?.rating || "NA"}/5</span>
                      </div>
                      <div className={styles.metaItem}>
                        <Clock className={styles.icon} />
                        <span>
                          {doctor?.experience || "NA"} years of Experience
                        </span>
                      </div>
                      <div className={styles.metaItem}>
                        <MapPin className={styles.icon} />
                        <span>{doctor?.clinicAddress || "NA"}</span>
                      </div>
                    </div>

                    <div className={styles.availability}>
                      <Calendar className={styles.icon} />
                      <span>
                        Available on: {doctor?.availability.join(", ") || "NA"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <a
                    href={`tel:${doctor?.phone || "NA"}`}
                    className={styles.phoneButton}
                  >
                    <Phone className={styles.icon} />
                    {doctor.phone}
                  </a>
                  <button className={styles.bookButton}>
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorList;
