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
        const response = await axios.get( `http://localhost:5000/appointment/get/${id}`);
        if (response.data) {
          setDoctor(response.data);
          setFormData((prev) => ({
            ...prev,
            doctor: response.data.personalDetails.name,
          }));
          generateAvailableDates(response.data);
          console.log(response.data);
          

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
    console.log("Start time:", start, "End time:", end);

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
    console.log("Generated time slots:", slots);
    return slots;
  };

  const generateAvailableDates = (doctorData) => {
    if (!doctorData) return;
    const dates = [];
    const today = new Date();

    // Loop 30 days starting from today
    let d = new Date(today.getTime());
    for (let i = 0; i < 30; i++) {
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      if (doctorData.availability.days.includes(dayName)) {
        // Create a YYYY-MM-DD string based on local time
        const formattedDate = `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
        dates.push(formattedDate);
      }
      d.setDate(d.getDate() + 1);
    }
    console.log("Generated available dates:", dates);
    setAvailableDates(dates);
  };
  const convertToISO = (timeString, dateString) => {
    if (!timeString || !dateString) return null; // Ensure both values exist

    // Extract hours, minutes, and period (AM/PM) from time
    const timeParts = timeString.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (!timeParts) return null; // Invalid format

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const period = timeParts[3];

    // Convert 12-hour format to 24-hour format
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    // Construct full date-time string
    const formattedDate = `${dateString}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

    // Return ISO format
    return new Date(formattedDate).toISOString();
};

// Example form data


// Convert and log

  const handleSubmit = async (e) => {
 
    e.preventDefault();
    setIsSubmitted(true);
    setShowPending(true);
    const isoDate = convertToISO(formData.time, formData.date);
    

    const token = localStorage.getItem("token");
    const data = {
      doctor: id,
      concerns: formData.concerns,
      scheduledAt: isoDate,
      
      mode: formData.mode,
      
    };
   
    try {
      const response = await axios.post( "http://localhost:5000/appointment/save", data, {
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
    console.log("Changed", name, "to", value);

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

          {/* Concerns Input */}
          <div className={styles.formGroup}>
            <textarea
              name="concerns"
              value={formData.concerns || ""}
              onChange={handleChange}
              placeholder="Enter your concerns here..."
              rows={4}
              required
              className={formData.concerns ? styles.filled : ""}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              !formData.date ||
              !isDateAvailable(formData.date) ||
              !formData.time ||
              !formData.mode ||
              !formData.concerns
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
