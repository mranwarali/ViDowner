import { Fragment } from "react";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import IndexMessage from "./components/Layout/IndexMessage";
import SiteInformation from "./components/Layout/SiteInformation";
import UserInput from "./components/UserInput/UserInput";
import styles from "./App.module.css";

function App() {
  return (
    <Fragment>
      <div className={styles["main-div"]}>
        <Header />
        <main>
          <IndexMessage />
          <UserInput />
          <SiteInformation />
        </main>
      </div>
      <Footer />
    </Fragment>
  );
}

export default App;