import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import styles from "./Appointment.module.css";
import API from "../../api/axios";

const Appointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    mode: "",
    concerns: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const { id } = useParams();
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(API + `/appointment/get/${id}`);
        if (response.data) {
          setDoctor(response.data);
          setFormData((prev) => ({
            ...prev,
            doctor: response.data.personalDetails.name,
          }));
          generateAvailableDates(response.data);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };
    fetchDoctor();
  }, [id]);

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    let currentHours = start.hours;
    let currentMinutes = start.minutes;

    while (
      currentHours < end.hours ||
      (currentHours === end.hours && currentMinutes <= end.minutes)
    ) {
      const period = currentHours >= 12 ? "PM" : "AM";
      const displayHours = currentHours % 12 || 12;
      const timeSlot = `${displayHours}:${currentMinutes
        .toString()
        .padStart(2, "0")} ${period}`;
      slots.push(timeSlot);

      currentMinutes += 30;
      if (currentMinutes >= 60) {
        currentHours++;
        currentMinutes = 0;
      }
    }

    return slots;
  };

  const generateAvailableDates = (doctorData) => {
    if (!doctorData) return;

    const dates = [];
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    for (let d = new Date(today); d <= next30Days; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      if (doctorData.availability.days.includes(dayName)) {
        dates.push(new Date(d).toISOString().split("T")[0]);
      }
    }
    setAvailableDates(dates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setShowPending(true);

    const token = localStorage.getItem("token");
    const data = {
      doctor: id,
      doctorName: doctor.personalDetails.name,
      concerns: formData.concerns,
      scheduledAt: formData.date,
      time: formData.time,
      specialization: doctor.professionalDetails.specialization,
      mode: formData.mode,
    };

    try {
      const response = await axios.post(API + "/appointment/save", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setPatientId(response.data.id);
    } catch (error) {
      console.error("Error sending appointment request:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        time: "",
      }));

      if (doctor && value) {
        const [startTime, endTime] = doctor.availability.time.split(" - ");
        const slots = generateTimeSlots(startTime, endTime);
        setAvailableTimeSlots(slots);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
              <strong>Date:</strong>{" "}
              {new Date(formData.date).toLocaleDateString()}
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
            <p>
              Your appointment request has been sent to the doctor for approval.
              You will be notified once it's confirmed.
            </p>
          </div>
          <div className={styles.pendingActions}>
            <button
              className={styles.newAppointmentButton}
              onClick={() => navigate(`/patient/dashboard/${patientId}`)}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.headerIcon}>
          <Calendar size={32} />
        </div>
        <h1>Schedule Appointment</h1>
        <div className={styles.doctorInfo}>
          <h3>{doctor?.personalDetails.name}</h3>
          <p className={styles.specialization}>
            {doctor?.professionalDetails.specialization}
          </p>
          <p className={styles.availability}>
            Available on: {doctor?.availability.days.join(", ")}
            <br />
            Timing: {doctor?.availability.time}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <input
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
                required
                className={formData.date ? styles.filled : ""}
                min={new Date().toISOString().split("T")[0]}
                disabled={!doctor}
                onKeyDown={(e) => e.preventDefault()}
              />
              {formData.date && !isDateAvailable(formData.date) && (
                <div className={styles.dateError}>
                  Doctor is not available on this date
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.timeSlotWrapper}>
                <select
                  name="time"
                  value={formData.time || ""}
                  onChange={handleChange}
                  className={`${styles.timeSelect} ${
                    formData.time ? styles.filled : ""
                  }`}
                  disabled={!formData.date || !isDateAvailable(formData.date)}
                  required
                >
                  <option value="">Select time slot</option>
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <select
              name="mode"
              value={formData.mode || ""}
              onChange={handleChange}
              required
              className={formData.mode ? styles.filled : ""}
            >
              <option value="">Mode of Appointment</option>
              {["Online Consultation", "In-Person Visit"].map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              !formData.date ||
              !isDateAvailable(formData.date) ||
              !formData.time ||
              !formData.mode
            }
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
