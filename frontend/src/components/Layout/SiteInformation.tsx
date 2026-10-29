import styles from "./SiteInformation.module.css";

const SiteInformation = () => (
  <div className={styles["site-information"]}>
    <section id="about-us" aria-labelledby="about-us-title">
      <h2 id="about-us-title">About Vidown</h2>
      <p>
        Vidown is a browser-based tool that checks supported video links and
        displays available download formats. Supported sources include YouTube,
        Facebook, Instagram, and X.
      </p>
    </section>

    <section id="contact-us" aria-labelledby="contact-us-title">
      <h2 id="contact-us-title">Contact</h2>
      <p>
        For questions or support, contact the project maintainer through the
        <a href="https://github.com/mranwarali" target="_blank" rel="noopener noreferrer">
          GitHub profile
        </a>
        .
      </p>
    </section>

    <section id="privacy-policy" aria-labelledby="privacy-policy-title">
      <h2 id="privacy-policy-title">Privacy</h2>
      <p>
        When the app makes a request, its server records your IP address and
        browser/device details. When you submit a video URL, the URL and request
        time are saved in the app database and the URL is sent to third-party
        processing providers to retrieve video information. Those providers
        handle data under their own policies. Your theme preference is stored
        in this browser. The app does not currently define an automatic data
        deletion period.
      </p>
    </section>

    <section id="terms-of-use" aria-labelledby="terms-of-use-title">
      <h2 id="terms-of-use-title">Terms of Use</h2>
      <p>
        Use Vidown only for content you own or are authorized to access and
        download. You are responsible for complying with applicable law and the
        relevant platform terms. Availability and formats may change, and
        Vidown is provided without guarantees. Vidown is not affiliated with
        YouTube, Facebook, Instagram, or X.
      </p>
    </section>
  </div>
);

export default SiteInformation;