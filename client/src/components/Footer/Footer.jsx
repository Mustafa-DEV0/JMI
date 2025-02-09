import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <Link to="/" className={styles.footerLogo}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-H527dHvLVlfePT33KaYtu0YPXiOqLP.png"
                alt="Prescripto Logo"
              />
              <span>MediSure</span>
            </Link>
            <p className={styles.footerDescription}>
            We are dedicated to providing exceptional healthcare management solutions to improve patient outcomes and streamline operations. Our platform is designed to help you manage your health and wellness with ease.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h3>COMPANY</h3>
            <div className={styles.footerLinks}>
              <Link to="/">Home</Link>
              <Link to="/about">About us</Link>
              <Link to="/delivery">Delivery</Link>
              <Link to="/privacy-policy">Privacy policy</Link>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3>GET IN TOUCH</h3>
            <div className={styles.footerLinks}>
              <a href="tel:+0-000-000-000">+0-000-000-000</a>
              <a href="mailto:samrod625@gmail.com">medicare@gmail.org</a>
            </div>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          Copyright 2024 @ Medisure - All Right Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
