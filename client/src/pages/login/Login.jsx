import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className={styles.formpage}>
            <div className={`${styles.formCard} ${styles.slideIn}`} id="loginForm">
                <h2>Login</h2>
                <form>
                    <div className={styles.inputGroup}>
                        <input type="text" id="username" placeholder=" " required />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className={styles.inputGroup}>
                        <input type={passwordVisible ? 'text' : 'password'} id="password" placeholder=" " required />
                        <label htmlFor="password">Password</label>
                        <button type="button" className={styles.togglePassword} onClick={togglePassword}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.eyeIcon}>
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                        <span className={styles.btnText}>Login</span>
                        <div className={styles.loadingSpinner} style={{ display: 'none' }}></div>
                    </button>
                </form>
                <p className={styles.switchForm}>
                    Don't have an account? 
                    <a href="#" onClick={() => document.getElementById('signupForm').style.display = 'block'}>Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
