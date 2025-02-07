import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      // Assuming the response contains a token and user data
      const { token } = response.data;
      // Save the token and user data to local storage or context
      localStorage.setItem("token", token);
     
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      const userId = decoded.id; 
      // Redirect to  dashboard
      navigate(`/patient/${userId}`);
    } catch (error) {
      setError("Invalid username or password");
      console.log(error)
    }
  };

  return (
    <div className={styles.formpage}>
      <div className={`${styles.formCard} ${styles.slideIn}`} id="loginForm">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="username"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className={styles.inputGroup}>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className={styles.togglePassword}
              onClick={togglePassword}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.eyeIcon}
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn}>
            <span className={styles.btnText}>Login</span>
            <div className={styles.loadingSpinner} style={{ display: "none" }}></div>
          </button>
        </form>
        <p className={styles.switchForm}>
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
