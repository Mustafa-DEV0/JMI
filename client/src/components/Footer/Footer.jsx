import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <a href="#" className={styles.footerLogo}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-H527dHvLVlfePT33KaYtu0YPXiOqLP.png"
                alt="Prescripto Logo"
              />
              <span>Prescripto</span>
            </a>
            <p className={styles.footerDescription}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of type
              and scrambled it to make a type specimen book.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h3>COMPANY</h3>
            <div className={styles.footerLinks}>
              <a href="#">Home</a>
              <a href="#">About us</a>
              <a href="#">Delivery</a>
              <a href="#">Privacy policy</a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3>GET IN TOUCH</h3>
            <div className={styles.footerLinks}>
              <a href="tel:+0-000-000-000">+0-000-000-000</a>
              <a href="mailto:greatstackdev@gmail.com">greatstackdev@gmail.com</a>
            </div>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          Copyright 2024 @ Greatstack.dev - All Right Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
