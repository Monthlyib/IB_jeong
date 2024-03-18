import Link from "next/link";
import styles from "./AppLayout.module.css";
import { RightOutlined } from "@ant-design/icons";

const Resource = () => {
  return (
    <>
      <Link href="/board">자료실</Link>
      <ul className={styles.gnb2}>
        <li>
          <Link href="/board">
            <span>IB 입시뉴스</span>
            <RightOutlined className={styles.icon} />
          </Link>
        </li>
        <li>
          <Link href="/board/calc">
            <span>합격예측 계산기</span>
            <RightOutlined className={styles.icon} />
          </Link>
        </li>
        <li>
          <Link href="/board/archive">
            <span>자료실</span>
            <RightOutlined className={styles.icon} />
          </Link>
        </li>
        <li>
          <Link href="/board/bulletinboard">
            <span>자유게시판</span>
            <RightOutlined className={styles.icon} />
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Resource;
