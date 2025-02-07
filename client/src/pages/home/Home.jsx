import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Revolutionizing Healthcare Management</h1>
          <p>
            Streamline your hospital operations with our state-of-the-art
            system.
          </p>
          <Link to="/" className={styles.ctaButton}>
            Get Started
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Our Features</h2>
        <div className={styles.featureCards}>
          <div className={styles.featureCard}>
            <i className="fas fa-chart-line"></i>
            <h3>Data Analytics</h3>
            <p>Gain insights from comprehensive healthcare data analysis.</p>
          </div>
          <div className={styles.featureCard}>
            <i className="fas fa-user-injured"></i>
            <h3>Patient Management</h3>
            <p>Manage patient records and appointments efficiently.</p>
          </div>
          <div className={styles.featureCard}>
            <i className="fas fa-pills"></i>
            <h3>Inventory Control</h3>
            <p>Track and manage medical supplies with ease.</p>
          </div>
          <div className={styles.featureCard}>
            <i className="fas fa-calendar-check"></i>
            <h3>Appointment Scheduling</h3>
            <p>Seamless scheduling and reminders for patients.</p>
          </div>
          <div className={styles.featureCard}>
            <i className="fas fa-file-medical"></i>
            <h3>Electronic Health Records</h3>
            <p>Securely store and manage patient health records.</p>
          </div>
          <div className={styles.featureCard}>
            <i className="fas fa-file-invoice-dollar"></i>
            <h3>Billing & Insurance</h3>
            <p>Simplify payments and insurance claims management.</p>
          </div>
        </div>
      </section>

      <section className={styles.services}>
        <h2>Our Services</h2>
        <div className={styles.serviceList}>
          <div className={styles.serviceItem}>
            <h3>24/7 Support</h3>
            <p>Round-the-clock assistance for all your needs.</p>
          </div>
          <div className={styles.serviceItem}>
            <h3>AI-Powered Assistance</h3>
            <p>Utilizing AI for advanced diagnostics and automation.</p>
          </div>
          <div className={styles.serviceItem}>
            <h3>Secure Cloud Storage</h3>
            <p>Store data securely with high-end encryption.</p>
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2>What Our Clients Say</h2>
        <div className={styles.testimonialCarousel}>
          <div className={styles.testimonial}>
            <p>
              "MediCare has transformed our hospital's efficiency. Highly
              recommended!"
            </p>
            <cite>- Dr. Jane Smith</cite>
          </div>
          <div className={styles.testimonial}>
            <p>"The intuitive interface makes daily operations seamless."</p>
            <cite>- Mark Johnson</cite>
          </div>
        </div>
      </section>

      <main>
        <section className={styles.contact}>
          <div className={styles.container}>
            <h2>Contact Us</h2>
            <form>
              <input type="text" placeholder="Name" required />
              <input type="email" placeholder="Email" required />
              <textarea placeholder="Message" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
