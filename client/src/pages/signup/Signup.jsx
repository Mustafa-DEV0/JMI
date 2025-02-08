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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          userType,
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      const id = response.data.user.id;
      const typeUser = response.data.user.userType;
      setSuccess(response.data.message || "Registration successful!");
      setTimeout(() => navigate(`/${typeUser}/${id}`), 2000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>
      
      <div className={`${styles.formCard} ${styles.glassEffect}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.cross}></span>
          </div>
        </div>
        
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Join our healthcare community</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.userTypeContainer}>
            <label className={styles.userTypeLabel}>I am a</label>
            <div className={styles.userTypeOptions}>
              {['patient', 'doctor', 'admin'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.userTypeBtn} ${userType === type ? styles.active : ''}`}
                  onClick={() => setUserType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputLine}></div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputLine}></div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <button 
            type="submit" 
            className={`${styles.submitBtn} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading || !userType}
          >
            <span className={styles.btnText}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </span>
            <div className={styles.btnGlow}></div>
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <p className={styles.switchForm}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;