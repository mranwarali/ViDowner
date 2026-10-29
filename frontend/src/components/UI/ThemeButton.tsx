import moonIcon from "../../assets/icons8-moon-48.png";
import sunIcon from "../../assets/icons8-sun-48.png";
import { useTheme } from "../../store/ThemeContext";
import styles from "./ThemeButton.module.css";

const ThemeButton = () => {
  const { theme, themeControler } = useTheme();
  const isDark = theme === "dark";
  const buttonIcon = isDark ? moonIcon : sunIcon;
  const buttonClassName = `${styles["theme-btn"]} ${
    isDark ? styles["theme-btn-dark"] : styles["theme-btn-light"]
  }`;
  const roundClassName = `${styles["theme-btn-round"]} ${
    isDark ? styles["theme-btn-round-dark"] : styles["theme-btn-round-light"]
  }`;

  return (
    <button
      type="button"
      onClick={themeControler}
      aria-label="Toggle theme"
      className={buttonClassName}
    >
      <span className={roundClassName}>
        <img src={buttonIcon} alt="theme icon" />
      </span>
    </button>
  );
};

export default ThemeButton;