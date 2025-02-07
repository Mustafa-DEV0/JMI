import React, { useState } from "react";
import styles from "./Signup.module.css";

const Signup = () => {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-up logic here
    console.log("User Type:", userType);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className={styles.formpage}>

    <div className={styles.formCard}>
      <h2 className={styles.heading}>Sign Up</h2>
      
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

      {/* Submit Button */}
      <button type="submit" className={styles.submitBtn} onClick={handleSubmit}>
        <span className={styles.btnText}>Sign Up</span>
      </button>

      {/* Switch Form Link */}
      <p className={styles.switchForm}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
    </div>

  );
};

export default Signup;
