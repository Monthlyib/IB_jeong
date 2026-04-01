"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../MainBottom.module.css";
import MainBottomSwiper from "../MainBottomSwiper";
import { useCourseStore } from "@/store/course";
import { useQuestionStore } from "@/store/question";
import { useTutoringStore } from "@/store/tutoring";

const PREVIEW_EMPTY_STATES = [
  { text: "수강중인 강의가 없습니다.", href: "/course", label: "영상강의 이동" },
  { text: "예약된 수업이 없습니다", href: "/tutoring", label: "예약하기" },
  { text: "등록된 질문글이 없습니다.", href: "/question", label: "질문하기" },
];

const MainMemberActivitySection = ({
  title = "나의 프로필 관리",
  previewMode = false,
}) => {
  const [tab, setTab] = useState(0);
  const [currentPage] = useState(1);
  const { coursePosts, getUserCourseList } = useCourseStore();
  const { getUserQuestionList, questionList } = useQuestionStore();
  const { getTutoringDateList, tutoringDateList } = useTutoringStore();

  useEffect(() => {
    if (previewMode) {
      return;
    }

    const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    const session = localUserInfo?.state?.userInfo;
    if (session?.userId !== undefined) {
      getUserCourseList(session.userId, currentPage - 1, session);
      getTutoringDateList("", "", 0, session);
      getUserQuestionList("", 0, "", session);
    }
  }, [currentPage, getTutoringDateList, getUserCourseList, getUserQuestionList, previewMode]);

  const renderEmptyState = (emptyState) => (
    <div className={styles.no_item}>
      <p>{emptyState.text}</p>
      <Link href={emptyState.href}>{emptyState.label}</Link>
    </div>
  );

  const renderPreviewContent = () => (
    <div
      className={`${styles.cm_tab_cont} ${styles.archive_board_cont}`}
      id="cm"
    >
      {renderEmptyState(PREVIEW_EMPTY_STATES[tab])}
    </div>
  );

  return (
    <section className={styles.community_wrap}>
      <h2>
        {title} <Link href="#" />
        <FontAwesomeIcon icon={faAngleRight} />
      </h2>
      <div className={styles.cm_tab}>
        <button
          className={tab === 0 ? styles.active : ""}
          onClick={() => setTab(0)}
          type="button"
        >
          수업중인 강의
        </button>
        <button
          className={tab === 1 ? styles.active : ""}
          onClick={() => setTab(1)}
          type="button"
        >
          수업 스케쥴링
        </button>
        <button
          className={tab === 2 ? styles.active : ""}
          onClick={() => setTab(2)}
          type="button"
        >
          나의 질문리스트
        </button>
      </div>

      {previewMode ? (
        renderPreviewContent()
      ) : (
        <>
          <div
            className={`${styles.cm_tab_cont} ${styles.archive_board_cont}`}
            id={tab === 0 ? "cm" : ""}
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
              renderEmptyState(PREVIEW_EMPTY_STATES[0])
            )}
          </div>
          <div
            className={`${styles.cm_tab_cont} ${styles.schedule_board_cont}`}
            id={tab === 1 ? "cm" : ""}
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
                <p>{PREVIEW_EMPTY_STATES[1].text}</p>
                <Link href={PREVIEW_EMPTY_STATES[1].href}>
                  {PREVIEW_EMPTY_STATES[1].label}
                </Link>
              </div>
            )}
          </div>
          <div
            className={`${styles.cm_tab_cont} ${styles.schedule_board_cont}`}
            id={tab === 2 ? "cm" : ""}
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
              renderEmptyState(PREVIEW_EMPTY_STATES[2])
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default MainMemberActivitySection;
