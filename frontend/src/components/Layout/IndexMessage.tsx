import style from "./IndexMessage.module.css";

const IndexMessage = () => (
  <section className={style["index-div"]} aria-labelledby="page-title">
    <h1 id="page-title">
      <span className={style["head-one"]}>Vidown </span>
      <span className={style["head-two"]}>Video </span>
      Do<span className={style["head-three"]}>wnloader</span>
    </h1>

    <p>
      <strong>Vidown Video Downloader</strong> lets you easily download videos from
      <strong> YouTube</strong>, <strong>Facebook</strong>,
      <strong> Instagram</strong>, and <strong>X (Twitter)</strong>. Enjoy quick,
      high-quality, and hassle-free downloads so you can watch your favorite
      videos offline anytime, anywhere.
    </p>

    <img
      className={style["yt-logo"]}
      width="144"
      height="144"
      src="https://img.icons8.com/fluency/144/youtube-play.png"
      alt="Download YouTube videos"
    />
    <img
      className={style["fb-logo"]}
      width="144"
      height="144"
      src="https://img.icons8.com/fluency/144/facebook-new.png"
      alt="Download Facebook videos"
    />
    <img
      className={style["insta-logo"]}
      width="144"
      height="144"
      src="https://img.icons8.com/fluency/144/instagram-new.png"
      alt="Download Instagram videos"
    />
    <img
      className={style["x-logo"]}
      width="144"
      height="144"
      src="https://img.icons8.com/fluency/144/twitter.png"
      alt="Download X (Twitter) videos"
    />
  </section>
);

export default IndexMessage;