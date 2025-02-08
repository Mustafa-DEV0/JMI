import  { useState, useEffect } from 'react';
import { Check, Calendar, Clock, AlertCircle } from 'lucide-react';
import styles from './Appointment.module.css';

const Appointment = () => {
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    mode: '',
    concerns: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Mock data - replace with actual API calls
  const doctorsAvailability = {
    'Dr. Sarah Wilson - Cardiologist': {
      id: 'DOC001',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: {
        'Monday': ['09:00 AM - 10:00 AM', '02:00 PM - 03:00 PM'],
        'Wednesday': ['10:00 AM - 11:00 AM', '03:00 PM - 04:00 PM'],
        'Friday': ['11:00 AM - 12:00 PM', '04:00 PM - 05:00 PM']
      }
    },
    'Dr. James Chen - General Physician': {
      id: 'DOC002',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlots: {
        'Tuesday': ['09:00 AM - 10:00 AM', '02:00 PM - 03:00 PM'],
        'Thursday': ['10:00 AM - 11:00 AM', '03:00 PM - 04:00 PM'],
        'Saturday': ['11:00 AM - 12:00 PM', '04:00 PM - 05:00 PM']
      }
    }
  };

  const appointmentModes = [
    'Online Consultation',
    'In-Person Visit'
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorFromUrl = urlParams.get('doctor');
    
    if (doctorFromUrl && doctorsAvailability[doctorFromUrl]) {
      setSelectedDoctor(doctorFromUrl);
      setFormData(prev => ({ ...prev, doctor: doctorFromUrl }));
      generateAvailableDates(doctorFromUrl);
    }
  }, []);

  const generateAvailableDates = (doctorName) => {
    const doctor = doctorsAvailability[doctorName];
    if (!doctor) return;

    const dates = [];
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    for (let d = new Date(today); d <= next30Days; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      if (doctor.availableDays.includes(dayName)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
      }
    }
    setAvailableDates(dates);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setShowPending(true);
    
    // Simulate API call to create appointment
    const appointmentData = {
      ...formData,
      doctorId: doctorsAvailability[formData.doctor].id,
      status: 'pending',
      appointmentId: `APT${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    
    console.log('Appointment Data:', appointmentData);
    
    // In a real application, you would make an API call here
    // and handle the response accordingly
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'doctor') {
      setSelectedDoctor(value);
      generateAvailableDates(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        date: '',
        time: ''
      }));
    } else if (name === 'date') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        time: ''
      }));
      if (selectedDoctor && value) {
        const dayName = new Date(value).toLocaleDateString('en-US', { weekday: 'long' });
        setAvailableTimeSlots(doctorsAvailability[selectedDoctor].timeSlots[dayName] || []);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const isDateAvailable = (date) => {
    return availableDates.includes(date);
  };

  if (showPending) {
    return (
      <div className={styles.container}>
        <div className={styles.pendingCard}>
          <div className={styles.pendingIcon}>
            <Clock size={48} className={styles.clockIcon} />
          </div>
          <h2>Appointment Request Pending</h2>
          <div className={styles.pendingDetails}>
            <div className={styles.pendingInfo}>
              <strong>Doctor:</strong> {formData.doctor}
            </div>
            <div className={styles.pendingInfo}>
              <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
            </div>
            <div className={styles.pendingInfo}>
              <strong>Time:</strong> {formData.time}
            </div>
            <div className={styles.pendingInfo}>
              <strong>Mode:</strong> {formData.mode}
            </div>
          </div>
          <div className={styles.pendingMessage}>
            <AlertCircle size={20} />
            <p>Your appointment request has been sent to the doctor for approval. You will be notified once it's confirmed.</p>
          </div>
          <div className={styles.pendingActions}>
            <button 
              onClick={() => {
                setShowPending(false);
                setIsSubmitted(false);
                setFormData({
                  doctor: '',
                  date: '',
                  time: '',
                  mode: '',
                  concerns: ''
                });
              }}
              className={styles.newAppointmentButton}
            >
              Schedule Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.formCard} ${isSubmitted ? styles.submitted : ''}`}>
        <div className={styles.headerIcon}>
          <Calendar size={32} />
        </div>
        <h1>Schedule Appointment</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <select 
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              className={formData.doctor ? styles.filled : ''}
              disabled={selectedDoctor !== null}
            >
              <option value="">Choose a doctor</option>
              {Object.keys(doctorsAvailability).map((doctor) => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
            {selectedDoctor && (
              <div className={styles.availabilityInfo}>
                Available on: {doctorsAvailability[selectedDoctor].availableDays.join(', ')}
              </div>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={formData.date ? styles.filled : ''}
                min={new Date().toISOString().split('T')[0]}
                disabled={!selectedDoctor}
                onKeyDown={(e) => e.preventDefault()}
              />
              {formData.date && !isDateAvailable(formData.date) && (
                <div className={styles.dateError}>
                  Doctor is not available on this date
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className={formData.time ? styles.filled : ''}
                disabled={!formData.date || !isDateAvailable(formData.date)}
              >
                <option value="">Select time slot</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
              className={formData.mode ? styles.filled : ''}
            >
              <option value="">Mode of Appointment</option>
              {appointmentModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <textarea
              name="concerns"
              value={formData.concerns}
              onChange={handleChange}
              placeholder="Any specific concerns or requirements?"
              className={formData.concerns ? styles.filled : ''}
            />
          </div>

          <button 
            type="submit" 
            className={`${styles.submitButton} ${isSubmitted ? styles.submitted : ''}`}
            disabled={!formData.date || !isDateAvailable(formData.date)}
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;