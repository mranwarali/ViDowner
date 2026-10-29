import { fetchDownload, setManualError } from "../../store/downloadSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Platform } from "../../types";
import ErrorMessage from "../UI/Error";
import Loader from "../UI/Loader";
import ResultSection from "../ResultSection/ResultSection";
import InputSection from "./InputSection";
import styles from "./UserInput.module.css";

const UserInput = () => {
  const dispatch = useAppDispatch();
  const { status, result, error } = useAppSelector((state) => state.download);

  const userInputHandler = async (url: string, type: Platform | "error") => {
    if (type === "error") {
      dispatch(setManualError(url));
      return;
    }

    dispatch(fetchDownload({ url, type }));
  };

  const showResult = status === "succeeded" && result.urls.length > 0;
  const hasError = status === "failed" && !!error;

  return (
    <div className={styles["input-div"]}>
      <div>
        <InputSection userUrls={userInputHandler} />
      </div>
      {status === "loading" && <Loader />}
      {showResult && <ResultSection result={result} />}
      {hasError && <ErrorMessage error={error ?? ""} />}
    </div>
  );
};

export default UserInput;