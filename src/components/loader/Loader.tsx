import styles from "./Loader.module.css";
function Loader({ isFullScreen = false }) {
  return (
    <div
      className={`${
        isFullScreen ? "fixed" : "absolute"
      } inset-0 z-10 bg-[#F5F6F8] grid place-content-center`}
    >
      <span className={styles.loader}></span>
    </div>
  );
}

export default Loader;
