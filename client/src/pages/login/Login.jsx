import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { IdCardIcon } from "lucide-react";

const Login = () => {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          userType,
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        navigate(`/${userType}/dashboard/${response.data.id}`);
      }, 2000);
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className={styles.formpage}>
      <div className={styles.formCard}>
        <h2 className={styles.heading}>Login</h2>
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
              <option value="medicalstore">Medical Store Ownwer</option>
            </select>
          </div>

          {/* Email Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={togglePassword}
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Submit Button */}
          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>

        {/* Switch Form Link */}
        <p className={styles.switchForm}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
