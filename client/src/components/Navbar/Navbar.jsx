import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/login");
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gIg0k2I4KamRyeqQufC8X0g2zqQUCp.png"
            alt="Prescripto Logo"
          />
          <span>Prescripto</span>
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={styles.active}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/features">Features</Link>
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
                      <Link to="/PrimaryCare">Primary Care</Link>
                    </li>
                    <li>
                      <Link to="/SpecialityCare">Specialist Care</Link>
                    </li>
                    <li>
                      <Link to="/EmergencyCare">Emergency Care</Link>
                    </li>
                    <li>
                      <Link to="/PreventiveCare">Preventive Care</Link>
                    </li>
                  </ul>
                </div>
                <div className={styles.dropdownSection}>
                  <h3>Support Services</h3>
                  <ul>
                    <li>
                      <Link to="#">Lab Tests</Link>
                    </li>
                    <li>
                      <Link to="#">Pharmacy</Link>
                    </li>
                    <li>
                      <Link to="#">Rehabilitation</Link>
                    </li>
                    <li>
                      <Link to="#">Mental Health</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div className={styles.navRight}>
          {token ? (
            <button onClick={handleLogout} className={styles.createAccount}>
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate(`/register`)}
              className={styles.createAccount}
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
