// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const scrollToSection = (sectionId) => (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      // If not on home page, navigate to home page first
      navigate(`/#${sectionId}`);
    } else {
      // If already on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={styles.navbarWrapper}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gIg0k2I4KamRyeqQufC8X0g2zqQUCp.png"
              alt="Prescripto Logo"
            />
          </div>
          <span className={styles.logoText}>MediSure</span>
        </Link>

        <ul className={styles.navLinks}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.active}>
              Home
            </Link>
          </li>
          <li className={styles.navItem}>
            <a href="#features" onClick={scrollToSection('features')}>
              Features
            </a>
          </li>

          <li className={`${styles.navItem} ${styles.dropdown}`}>
            <Link to="#" className={styles.dropdownToggle}>
              Services
            </Link>
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownSection}>
                  <h3>Medical Services</h3>
                  <ul>
                    <li>
                      <Link to="/doctorlist">Find me Doctor</Link>
                    </li>
                    <li>
                      <Link to="/medical-store">Medicine Store</Link>
                    </li>
                  </ul>
                </div>
                <div className={styles.dropdownSection}>
                  <h3>Personal Services</h3>
                  <ul>
                    <li>
                      <Link to="/dashboard">My Dashboard</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div className={styles.navRight}>
          {token ? (
            <button onClick={handleLogout} className={styles.actionButton}>
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate(`/register`)}
              className={styles.actionButton}
            >
              Create Account
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
