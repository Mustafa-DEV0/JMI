import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Calendar, Clock, AlertCircle } from "lucide-react";
import styles from "./Appointment.module.css";

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

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/appointment/get/${id}`
        );
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

  const generateAvailableDates = (doctor) => {
    if (!doctor) return;

    const dates = [];
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    for (let d = new Date(today); d <= next30Days; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      if (doctor.availability.days.includes(dayName)) {
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
    const selectedDate = formData.date;
    const selectedTimeSlot = availableTimeSlots.find(
      (slot) => slot === formData.time
    );

    if (!selectedDate) {
      console.error("Invalid appointment details.");
      return;
    }

    const data = {
      doctor: id,
      doctorName: doctor.personalDetails.name,
      concerns: formData.concerns,
      scheduledAt: selectedDate,
      mode: formData.mode,
    };

    console.log("Sending appointment:", data);

    try {
      await axios.post("http://localhost:5000/appointment/save", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
        const dayName = new Date(value).toLocaleDateString("en-US", {
          weekday: "long",
        });

        const doctorTimeSlots = doctor.timeSlots?.[dayName] || [];
        setAvailableTimeSlots(doctorTimeSlots);
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
              onClick={() => navigate("/dashboard")}
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
      <div
        className={`${styles.formCard} ${isSubmitted ? styles.submitted : ""}`}
      >
        <div className={styles.headerIcon}>
          <Calendar size={32} />
        </div>
        <h1>Schedule Appointment</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="doctor"
              value={doctor?.personalDetails.name || ""}
              disabled
              className={styles.filled}
            />
            {doctor && (
              <div className={styles.availabilityInfo}>
                Available on: {doctor.availability.days.join(", ")}
              </div>
            )}
          </div>

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
              <select
                name="time"
                value={formData.time || ""}
                onChange={handleChange}
                className={formData.time ? styles.filled : ""}
                disabled={!formData.date || !isDateAvailable(formData.date)}
              >
                <option value="">Select time slot</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot.time}>
                    {slot.time}
                  </option>
                ))}
              </select>
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
