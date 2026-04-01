"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../MainBottom.module.css";

const MainReviewSection = ({ title = "수강생 리뷰" }) => {
  return (
    <section className={`${styles.community_wrap} ${styles.review_wrap}`}>
      <div className={styles.section_flex}>
        <h2>
          {title}{" "}
          <Link href="#">
            <FontAwesomeIcon icon={faAngleRight} />
          </Link>
        </h2>
        <div className={styles.controller}>
          <button type="button" className="left_btn">
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button type="button" className="right_btn">
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
      <div className={styles.review_swiper}>
        <div className={styles.board_list}>
          <div className={styles.no_item}>
            <p>곧 수강생 리뷰가 이 영역에 노출됩니다.</p>
            <Link href="/course">강의 보러가기</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainReviewSection;
