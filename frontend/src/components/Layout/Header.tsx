import ThemeButton from "../UI/ThemeButton";
import styles from "./Header.module.css";

const Header = () => (
  <header
    className={styles.header}
    role="banner"
    itemScope
    itemType="https://schema.org/WPHeader"
  >
    <a
      href="/"
      aria-label="Social Video Downloader - Home"
    >
      <span className={styles.brand} itemProp="name">
        Vi<span className={styles["brand-accent"]} itemProp="alternateName">Dow</span>ner
      </span>
    </a>
    <nav aria-label="Theme controls">
      <ThemeButton />
    </nav>
  </header>
);

export default Header;