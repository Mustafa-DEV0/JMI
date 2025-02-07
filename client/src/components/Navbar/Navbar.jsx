import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <div>
      <nav className={styles.navbar}>
        <a href="#" className={styles.logo}>
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gIg0k2I4KamRyeqQufC8X0g2zqQUCp.png" 
            alt="Prescripto Logo"
          />
          <span>Prescripto</span>
        </a>

        <ul className={styles.navLinks}>
          <li><a href="/" className={styles.active}>Home</a></li>
          <li><a href="#features">Features</a></li>

          <li className={`${styles.navItem} ${styles.dropdown}`}>
            <a href="#" className={styles.dropdownToggle}>Services</a>
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownSection}>
                  <h3>Medical Services</h3>
                  <ul>
                    <li><a href="/PrimaryCare">Primary Care</a></li>
                    <li><a href="/SpecialityCare">Specialist Care</a></li>
                    <li><a href="/EmergencyCare">Emergency Care</a></li>
                    <li><a href="/PreventiveCare">Preventive Care</a></li>
                  </ul>
                </div>
                <div className={styles.dropdownSection}>
                  <h3>Support Services</h3>
                  <ul>
                    <li><a href="#">Lab Tests</a></li>
                    <li><a href="#">Pharmacy</a></li>
                    <li><a href="#">Rehabilitation</a></li>
                    <li><a href="#">Mental Health</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>

          <li><a href="/Signup">Signup</a></li>
          <li><a href="/Login">Login</a></li>
        </ul>

        <div className={styles.navRight}>
          <a href="#" className={styles.adminLink}>Admin Panel</a>
          <a href="/Signup" className={styles.createAccount}>Create account</a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
