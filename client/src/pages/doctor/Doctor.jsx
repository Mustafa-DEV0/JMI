import React, { useState } from 'react';
import { ChevronRight, Guitar as Hospital, User, Phone, Mail, Award, Clock, MapPin } from 'lucide-react';
import styles from './Doctor.module.css';

const Doctor = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    personalDetails: {
      name: '',
      age: '',
      phone: '',
      gender: ''
    },
    professionalDetails: {
      specialization: '',
      qualification: '',
      experience: '',
      mobileNumber: '',
      consultingFees: '',
      medicalLicenseId: ''
    },
    availability: {
      days: [],
      time: ''
    },
    clinicOrHospital: {
      address: '',
      officeNumber: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof field === 'string'
        ? value
        : {
            ...prev[section],
            [field]: value
          }
    }));
  };

  const handleDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission here
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Doctor Details</h1>
        
        <div className={styles.progressBar}>
          <div 
            className={`${styles.progress} ${
              activeSection === 'professional' ? styles.halfFilled :
              activeSection === 'availability' ? styles.filled : ''
            }`}
          />
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.section} ${activeSection === 'personal' ? styles.active : ''}`}>
            <h2><User className={styles.icon} /> Personal Details</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.personalDetails.name}
                onChange={(e) => handleInputChange('personalDetails', 'name', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={formData.personalDetails.age}
                onChange={(e) => handleInputChange('personalDetails', 'age', e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.personalDetails.phone}
                onChange={(e) => handleInputChange('personalDetails', 'phone', e.target.value)}
                required
              />
              <select
                value={formData.personalDetails.gender}
                onChange={(e) => handleInputChange('personalDetails', 'gender', e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="button"
              className={styles.nextButton}
              onClick={() => setActiveSection('professional')}
            >
              Next <ChevronRight size={20} />
            </button>
          </div>

          <div className={`${styles.section} ${activeSection === 'professional' ? styles.active : ''}`}>
            <h2><Award className={styles.icon} /> Professional Details</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Specialization"
                value={formData.professionalDetails.specialization}
                onChange={(e) => handleInputChange('professionalDetails', 'specialization', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Qualification"
                value={formData.professionalDetails.qualification}
                onChange={(e) => handleInputChange('professionalDetails', 'qualification', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Years of Experience"
                value={formData.professionalDetails.experience}
                onChange={(e) => handleInputChange('professionalDetails', 'experience', e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.professionalDetails.mobileNumber}
                onChange={(e) => handleInputChange('professionalDetails', 'mobileNumber', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Consulting Fees"
                value={formData.professionalDetails.consultingFees}
                onChange={(e) => handleInputChange('professionalDetails', 'consultingFees', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Medical License ID"
                value={formData.professionalDetails.medicalLicenseId}
                onChange={(e) => handleInputChange('professionalDetails', 'medicalLicenseId', e.target.value)}
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setActiveSection('personal')}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.nextButton}
                onClick={() => setActiveSection('availability')}
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className={`${styles.section} ${activeSection === 'availability' ? styles.active : ''}`}>
            <h2><Clock className={styles.icon} /> Availability & Location</h2>
            <div className={styles.inputGroup}>
              <div className={styles.daysSelector}>
                {weekDays.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.dayButton} ${
                      formData.availability.days.includes(day) ? styles.selected : ''
                    }`}
                    onClick={() => handleDaysChange(day)}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Working Hours (e.g., 10:00 AM - 5:00 PM)"
                value={formData.availability.time}
                onChange={(e) => handleInputChange('availability', 'time', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Clinic/Hospital Address"
                value={formData.clinicOrHospital.address}
                onChange={(e) => handleInputChange('clinicOrHospital', 'address', e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Office Number"
                value={formData.clinicOrHospital.officeNumber}
                onChange={(e) => handleInputChange('clinicOrHospital', 'officeNumber', e.target.value)}
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setActiveSection('professional')}
              >
                Back
              </button>
              <button type="submit" className={styles.submitButton}>
                Submit Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Doctor;