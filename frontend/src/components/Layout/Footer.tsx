import gitLogo from "../../assets/icons8-github-logo-48.png";
import styles from "./Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <nav className={styles["footer-nav"]} aria-label="About and policies">
      <a href="#about-us">About</a>
      <a href="#contact-us">Contact</a>
      <a href="#privacy-policy">Privacy</a>
      <a href="#terms-of-use">Terms</a>
    </nav>
    <a
      href="https://github.com/mranwarali"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={gitLogo} alt="GitHub Logo" />
      <span className={styles.developer}>Anwar Ali</span>
    </a>
  </footer>
);

export default Footer;