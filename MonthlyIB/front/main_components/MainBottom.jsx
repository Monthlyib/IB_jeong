import Link from "next/link";
import styles from "./MainBottom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import MainBottomSwiper from "./MainBottomSwiper";
import MainReviewSwiper from "./MainReviewSwiper";
import { useState } from "react";
import { useSelector } from "react-redux";

const MainBottom = () => {
  const { User } = useSelector((state) => state.user);
  const { reviews } = useSelector((state) => state.review);
  const [tab, setTab] = useState(0);

  return (
    <>
      <section className={styles.community_wrap}>
        <h2>
          나의 프로필 관리 <Link href="#" />
          <FontAwesomeIcon icon={faAngleRight} />
        </h2>
        <div className={styles.cm_tab}>
          <button
            className={tab === 0 ? styles.active : ""}
            onClick={() => setTab(0)}
          >
            수업중인 강의
          </button>
          <button
            className={tab === 1 ? styles.active : ""}
            onClick={() => setTab(1)}
          >
            수업 스케쥴링
          </button>
          <button
            className={tab === 2 ? styles.active : ""}
            onClick={() => setTab(2)}
          >
            나의 질문리스트
          </button>
        </div>
        <div
          className={`${styles.cm_tab_cont} ${styles.archive_board_cont}`}
          id={tab === 0 ? styles.cm : ""}
        >
          <div className={styles.controller}>
            <button type="button" className="community_left_btn">
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button type="button" className="community_right_btn">
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          {User.courses?.length > 0 ? (
            <MainBottomSwiper posts={User.courses} />
          ) : (
            <div className={styles.no_item}>
              <p>수강중인 강의가 없습니다.</p>
              <Link href="/course">영상강의 이동</Link>
            </div>
          )}
        </div>
        <div
          className={`${styles.cm_tab_cont} ${styles.schedule_board_cont}`}
          id={tab === 1 ? styles.cm : ""}
        >
          <div className={styles.controller}>
            <button type="button" className="community_left_btn">
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button type="button" className="community_right_btn">
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          {User.tutors?.length > 0 ? (
            <MainBottomSwiper posts={User.tutors} />
          ) : (
            <div className={styles.no_schedule}>
              <p>예약된 수업이 없습니다</p>
              <Link href="/tutoring">예약하기</Link>
            </div>
          )}
        </div>
        <div
          className={`${styles.cm_tab_cont} ${styles.schedule_board_cont}`}
          id={tab === 2 ? styles.cm : ""}
        >
          <div className={styles.controller}>
            <button type="button" className="community_left_btn">
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button type="button" className="community_right_btn">
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          {User.qnas?.length > 0 ? (
            <MainBottomSwiper posts={User.qnas} />
          ) : (
            <div className={styles.no_item}>
              <p>등록된 질문글이 없습니다.</p>
              <Link href="/question">질문하기</Link>
            </div>
          )}
        </div>
      </section>
      <section className={`${styles.community_wrap} ${styles.review_wrap}`}>
        <div className={"section_flex"}>
          <h2>
            수강생 리뷰{" "}
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
            <MainReviewSwiper posts={reviews} />
          </div>
        </div>
      </section>
      <section className={styles.bank_wrap}>
        <h3>테스트뱅크 바로가기</h3>
        <Link
          href="https://agoran.kr/class"
          target="_blank"
          rel="noreferrer noopener"
        >
          바로가기
        </Link>
      </section>
    </>
  );
};

export default MainBottom;
