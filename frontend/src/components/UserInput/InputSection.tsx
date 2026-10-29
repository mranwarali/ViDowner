import { useState, type ChangeEvent, type FormEvent } from "react";
import urlDarkIcon from "../../assets/icons8-url-48-dark.png";
import urlLightIcon from "../../assets/icons8-url-48-light.png";
import { useTheme } from "../../store/ThemeContext";
import type { Platform } from "../../types";
import styles from "./InputSection.module.css";

interface InputSectionProps {
  userUrls: (url: string, type: Platform | "error") => void;
}

const InputSection = ({ userUrls }: InputSectionProps) => {
  const [userInput, setUserInput] = useState("");
  const [isInputValid, setInputValid] = useState(true);
  const { theme } = useTheme();

  const userInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValid(true);
    setUserInput(event.target.value);
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pattern = /^(https:\/\/|http:\/\/)/;
    if (!pattern.test(userInput)) {
      userUrls("Please enter a valid URL.", "error");
      setInputValid(false);
      return;
    }

    let type: Platform | undefined;
    if (userInput.includes("youtu")) type = "yt";
    if (userInput.includes("twitter.com") || userInput.includes("x.com")) {
      type = "tw";
    }
    if (userInput.includes("fb") || userInput.includes("facebook")) {
      type = "fb";
    }
    if (userInput.includes("instagram")) type = "ig";

    if (!type) {
      userUrls("This URL is not supported.", "error");
      setInputValid(false);
      return;
    }

    userUrls(userInput, type);
  };

  const urlIcon = theme === "dark" ? urlDarkIcon : urlLightIcon;

  return (
    <form method="POST" onSubmit={submitHandler} style={{ position: "relative" }}>
      <img className={styles["url-icon"]} src={urlIcon} alt="url icon" />
      <input
        className={`${styles.input} ${
          isInputValid
            ? ""
            : styles.invalid
        }`}
        type="text"
        name="search"
        placeholder="Past Link Here"
        onChange={userInputHandler}
        value={userInput}
        required
        aria-required="true"
      />
      <button
        className={styles.btn}
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default InputSection;