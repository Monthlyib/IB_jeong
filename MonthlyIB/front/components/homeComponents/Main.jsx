import styles from "./Main.module.css";
import MainTop from "./MainTop";
import MainMid from "./MainMid";
import MainBottom from "./MainBottom";

const Main = () => {
  return (
    <>
      <main id={styles.index}>
        <MainTop />
        <MainMid />
        <MainBottom />
      </main>
    </>
  );
};

export default Main;
