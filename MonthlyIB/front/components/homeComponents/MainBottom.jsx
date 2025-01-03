"use client";
import Link from "next/link";
import styles from "./MainBottom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import MainBottomSwiper from "./MainBottomSwiper";
import MainReviewSwiper from "./MainReviewSwiper";
import { useEffect, useState } from "react";
import { useCourseStore } from "@/store/course";
import { useTutoringStore } from "@/store/tutoring";
import { useQuestionStore } from "@/store/question";

const MainBottom = () => {
  const [tab, setTab] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const { coursePosts, getUserCourseList } = useCourseStore();
  const { getUserQuestionList, questionList } = useQuestionStore();
  const { getTutoringDateList, tutoringDateList } = useTutoringStore();

  useEffect(() => {
    const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (localUserInfo?.state.userInfo?.userId !== undefined) {
      getUserCourseList(
        localUserInfo.state.userInfo?.userId,
        currentPage - 1,
        localUserInfo.state.userInfo
      );
      getTutoringDateList("", "", 0, localUserInfo.state.userInfo);
      getUserQuestionList("", 0, "", localUserInfo.state.userInfo);
    }
  }, []);
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
          {coursePosts?.length > 0 ? (
            <MainBottomSwiper posts={coursePosts} type="video" />
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
          {tutoringDateList?.tutoring?.data?.length > 0 ? (
            <MainBottomSwiper
              posts={tutoringDateList?.tutoring?.data}
              type="tutoring"
            />
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
          {questionList?.length > 0 ? (
            <MainBottomSwiper posts={questionList} type="question" />
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
            {/* <MainReviewSwiper posts={reviews} /> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainBottom;
