import { useState } from "react";
import axios from "axios";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          userType, // Include user type
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      const id = response.data.id;
      setSuccess(response.data.message || "Registration successful!");
      setTimeout(() => navigate(`/${userType}/${id}`), 2000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formpage}>
      <div className={styles.formCard}>
        <h2 className={styles.heading}>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div className={styles.userTypeSelection}>
            <label>Select User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className={styles.userTypeDropdown}
              required
            >
              <option value="">Choose a user type</option>
              <option value="admin">Admin</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="medicalowner">Medical Store Owner</option>
            </select>
          </div>

          {/* Email Input */}
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          {/* Error and Success Messages */}
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          {/* Submit Button */}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Switch Form Link */}
        <p className={styles.switchForm}>
          Already have an account? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
