// Home.jsx
import React, { useEffect, useRef } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    // Handle hash navigation when coming from another page
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Empowering Your Health Journey with Smart Healthcare Solutions
          </h1>
          <p className={styles.heroSubtitle}>
            Seamless healthcare management, better patient outcomes, and optimized workflows
          </p>
          <button className={styles.ctaButton}>Get Started</button>
        </div>
        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Healthcare Professional"
          />
        </div>
      </section>

      {/* Video Section */}
      <section className={styles.videoSection}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={styles.backgroundVideo}
        >
          <source
            src="https://player.vimeo.com/external/474128497.sd.mp4?s=1f6d31809d31fa3f1a7e102f29944a524b59d88f&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
        <div className={styles.videoOverlay}>
          <h2>Experience Modern Healthcare</h2>
          <p>Transforming patient care through innovative technology</p>
        </div>
      </section>

      {/* Features Section - Added ID for scroll targeting */}
      <section id="features" className={styles.features}>
        <h2>Our Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Patient Dashboard</h3>
            <p>Access all your medical information in one place</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📅</div>
            <h3>Easy Appointments</h3>
            <p>Book and manage appointments with ease</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💊</div>
            <h3>Online Pharmacy</h3>
            <p>Order medicines from verified stores</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure Records</h3>
            <p>Your medical data is safe with us</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <h2>Our Services</h2>
        <div className={styles.serviceCards}>
          <div className={styles.serviceCard}>
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
              alt="Doctor Consultation"
            />
            <h3>Doctor Consultation</h3>
            <p>Connect with experienced healthcare professionals</p>
          </div>
          <div className={styles.serviceCard}>
            <img
              src="https://content.jdmagicbox.com/comp/def_content/laboratory-testing-services-for-water/laboratory-testing-service-for-water-3-laboratory-testing-services-for-water-6-s2hky.jpg"
              alt="Lab Tests"
            />
            <h3>Lab Tests</h3>
            <p>Coming Soon...</p>
          </div>
          <div className={styles.serviceCard}>
            <img
              src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
              alt="Medicine Delivery"
            />
            <h3>Medicine Delivery</h3>
            <p>Get medicines delivered to your doorstep</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2>What Our Users Say</h2>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialImage}>
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                alt="Sarah Johnson"
              />
            </div>
            <p>"The platform has made managing my health so much easier!"</p>
            <h4>Sarah Johnson</h4>
            <span>Patient</span>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialImage}>
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Dr. Michael Brown"
              />
            </div>
            <p>"Streamlined my practice and improved patient care."</p>
            <h4>Dr. Michael Brown</h4>
            <span>Healthcare Provider</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Sign Up</h3>
            <p>Create your account in minutes</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Book Services</h3>
            <p>Schedule appointments and order medicines</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Get Care</h3>
            <p>Receive quality healthcare services</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied users managing their healthcare journey</p>
            <a href='/register' className={styles.ctaButton}>Start Your Free Trial</a>
        </div>
      </section>
    </div>
  );
};

export default Home;