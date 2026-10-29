import styles from "./Error.module.css";

interface ErrorProps {
  error: string;
}

const ErrorMessage = ({ error }: ErrorProps) => (
  <div className={styles["error"]}>
    <h3>{error}</h3>
  </div>
);

export default ErrorMessage;