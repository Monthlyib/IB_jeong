import styles from "./BoardCommon.module.css";
import Link from "next/link";

const BoardCommon = ({ modal }) => {
  return (
    <nav className={styles.boardTabs} aria-label="Board sections">
      <div className={styles.boardTabsTrack}>
        <Link
          href="/board"
          className={`${styles.boardTabLink} ${
            modal === 0 ? styles.boardTabActive : ""
          }`}
        >
          IB 입시뉴스
        </Link>
        <Link
          href="/board/calculator"
          className={`${styles.boardTabLink} ${
            modal === 1 ? styles.boardTabActive : ""
          }`}
        >
          합격예측 계산기
        </Link>
        <Link
          href="/board/download"
          className={`${styles.boardTabLink} ${
            modal === 2 ? styles.boardTabActive : ""
          }`}
        >
          자료실
        </Link>
        <Link
          href="/board/free"
          className={`${styles.boardTabLink} ${
            modal === 3 ? styles.boardTabActive : ""
          }`}
        >
          자유게시판
        </Link>
      </div>
    </nav>
  );
};

export default BoardCommon;
