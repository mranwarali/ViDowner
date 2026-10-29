import type { VideoResult } from "../../types";
import styles from "./ResultSection.module.css";

interface ResultSectionProps {
  result: VideoResult;
}

const ResultSection = ({ result }: ResultSectionProps) => {
  const title = result.title.slice(0, 60) + " ....";
  return (
    <div className={styles["result-div"]}>
      <h2 className={styles["thumb-div"]}>
        <img src={result.thumb} alt="thumb" />
      </h2>

      <h3>{title}</h3>
      <div className={styles["download-section"]}>
        <table>
          <thead>
            <tr>
              <th>Quality</th>
              <th>Size</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {result.urls.map((url) => (
              <tr key={url.size}>
                <td>{url.quality}</td>
                <td>{url.size} MB</td>
                <td>
                  <a href={url.url} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultSection;
