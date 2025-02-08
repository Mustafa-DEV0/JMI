import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      setError("Invalid username or password");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>
      <div className={`${styles.formCard} ${styles.glassEffect}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.pulse}></span>
          </div>
        </div>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Your health journey continues here</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="username"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="username" className={styles.label}>Email</label>
            <div className={styles.inputLine}></div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputLine}></div>
            <button
              type="button"
              className={styles.togglePassword}
              onClick={togglePassword}
            >
              {passwordVisible ? (
                <span className={styles.eyeIcon}>👁️</span>
              ) : (
                <span className={styles.eyeIcon}>👁️‍🗨️</span>
              )}
            </button>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button 
            type="submit" 
            className={`${styles.submitBtn} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            <span className={styles.btnText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </span>
            <div className={styles.btnGlow}></div>
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <p className={styles.switchForm}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;