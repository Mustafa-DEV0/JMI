import React, { useState } from 'react';
import { Search, MapPin, Phone, Star, Clock, Calendar } from 'lucide-react';
import styles from './DoctorList.module.css';

const doctors = [
  {
    id: 1,
    name: "Dr. Peter Doe",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60",
    specialization: "Orthodontist",
    qualifications: "BDS, MDS",
    experience: "13+ Years",
    location: "Boston",
    rating: 4.7,
    consultationFee: 58,
    phone: "+1 (656) 738 1100",
    availability: ["Monday", "Wednesday", "Friday"]
  },
  {
    id: 2,
    name: "Dr. Sarah William",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
    specialization: "Dentofacial Orthopedist",
    qualifications: "BDS, MDS",
    experience: "8+ Years",
    location: "Boston",
    rating: 4.7,
    consultationFee: 100,
    phone: "+1 (678) 977 1103",
    availability: ["Tuesday", "Thursday", "Saturday"]
  },
  {
    id: 3,
    name: "Dr. Mathew John",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=60",
    specialization: "Orthodontist",
    qualifications: "BDS, MDS",
    experience: "5+ Years",
    location: "Boston",
    rating: 4.7,
    consultationFee: 40,
    phone: "+1 (764) 675 4368",
    availability: ["Monday", "Tuesday", "Friday"]
  }
];

const specializations = [
  "All",
  "Orthodontist",
  "Dentofacial Orthopedist",
  "Periodontist",
  "Endodontist"
];

const experienceRanges = [
  "All",
  "0-5 Years",
  "5-10 Years",
  "10+ Years"
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function DoctorList() {
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);

  const getExperienceYears = (experience) => {
    return parseInt(experience.split('+')[0]);
  };

  const checkExperienceRange = (doctorExperience, selectedRange) => {
    if (selectedRange === 'All') return true;
    const years = getExperienceYears(doctorExperience);
    
    switch(selectedRange) {
      case '0-5 Years':
        return years <= 5;
      case '5-10 Years':
        return years > 5 && years <= 10;
      case '10+ Years':
        return years > 10;
      default:
        return true;
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesGender = selectedGender === 'all' || 
      (selectedGender === 'male' && doctor.name.includes('Dr.')) ||
      (selectedGender === 'female' && doctor.name.includes('Dr.'));
    const matchesSpecialization = selectedSpecialization === 'All' || 
      doctor.specialization === selectedSpecialization;
    const matchesExperience = checkExperienceRange(doctor.experience, selectedExperience);
    const matchesDay = selectedDay === 'All' || doctor.availability.includes(selectedDay);
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = doctor.consultationFee >= priceRange[0] && 
      doctor.consultationFee <= priceRange[1];

    return matchesGender && matchesSpecialization && matchesExperience && 
           matchesDay && matchesSearch && matchesPrice;
  });

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.filtersTitle}>Filters</h2>
        
        <div className={styles.filterSection}>
          <h3>Gender</h3>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="gender"
                value="all"
                checked={selectedGender === 'all'}
                onChange={(e) => setSelectedGender(e.target.value)}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={selectedGender === 'male'}
                onChange={(e) => setSelectedGender(e.target.value)}
              />
              Male Doctor
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={selectedGender === 'female'}
                onChange={(e) => setSelectedGender(e.target.value)}
              />
              Female Doctor
            </label>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>Experience</h3>
          <select 
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className={styles.select}
          >
            {experienceRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Availability</h3>
          <select 
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className={styles.select}
          >
            <option value="All">All Days</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Consultation Fee</h3>
          <div className={styles.priceRange}>
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className={styles.rangeSlider}
            />
            <div className={styles.priceLabels}>
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search doctors by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterBar}>
          <div className={styles.resultCount}>
            {filteredDoctors.length} Doctors Available
          </div>
          <div className={styles.specializationFilter}>
            <select 
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className={styles.select}
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.doctorGrid}>
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.doctorInfo}>
                <img src={doctor.image} alt={doctor.name} className={styles.doctorImage} />
                <div className={styles.doctorDetails}>
                  <div className={styles.headerRow}>
                    <h3>{doctor.name}</h3>
                    <div className={styles.specialityTag}>
                      {doctor.specialization}
                    </div>
                  </div>
                  <p className={styles.qualifications}>{doctor.qualifications}</p>
                  <p className={styles.consultationFee}>
                    ${doctor.consultationFee} Consultation Fee
                  </p>
                  
                  <div className={styles.metadata}>
                    <div className={styles.metaItem}>
                      <Star className={styles.icon} />
                      <span>{doctor.rating}/5</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Clock className={styles.icon} />
                      <span>{doctor.experience}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <MapPin className={styles.icon} />
                      <span>{doctor.location}</span>
                    </div>
                  </div>

                  <div className={styles.availability}>
                    <Calendar className={styles.icon} />
                    <span>Available on: {doctor.availability.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.actionButtons}>
                <a href={`tel:${doctor.phone}`} className={styles.phoneButton}>
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
      </div>
    </div>
  );
}

export default DoctorList;