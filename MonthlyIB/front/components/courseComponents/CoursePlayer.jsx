"use client";
import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import CoursePlayerCurriculum from "./CoursePlayerCurriculum";
import { useCourseStore } from "@/store/course";

const CoursePlayer = (pageId) => {
  const [chapterNum, setChapterNum] = useState(-1);
  const [subChapterNum, setSubChapterNum] = useState(-1);
  const [modal, setModal] = useState(false);
  const { courseDetail, getCourseDetail } = useCourseStore();

  useEffect(() => {
    getCourseDetail(pageId?.pageId);
  }, []);

  useEffect(() => {
    if (chapterNum >= 0)
      console.log(courseDetail.chapters[chapterNum].subChapters[subChapterNum]);
  }, [chapterNum, subChapterNum]);

  return (
    <div className={styles.player_content}>
      <div className={styles.flex_top}>
        <nav className={styles.player_nav}>
          <button
            type="button"
            id="curri_btn"
            className={styles.curri_btn}
            onClick={() => setModal((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          {modal && (
            <div className={styles.player_curri}>
              <div className={styles.curri_tit_cont}>
                <span>강의 목차</span>
                <h3>강의 타이틀입니다</h3>
              </div>

              <div className={styles.course_curri_wrap}>
                <CoursePlayerCurriculum
                  curriculum={courseDetail.chapters}
                  className={styles.course_curri_inner}
                  setChapterNum={setChapterNum}
                  setSubChapterNum={setSubChapterNum}
                />
              </div>
            </div>
          )}
        </nav>

        {chapterNum >= 0 ? (
          <div className={styles.player_wrap}>
            <iframe
              width={"100%"}
              height={"100%"}
              auto
              src={
                "https://www.youtube.com/embed/" +
                courseDetail?.chapters[chapterNum].subChapters[
                  subChapterNum
                ]?.videoFileUrl.split("/")[
                  courseDetail?.chapters[chapterNum].subChapters[
                    subChapterNum
                  ]?.videoFileUrl.split("/").length - 1
                ]
              }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            >
              <source type="video/mp4" />
            </iframe>
          </div>
        ) : (
          <div className={styles.player_wrap}> </div>
        )}
      </div>

      <div className={styles.flex_bottom}>
        <div className={styles.player_bt_bar}>
          <div className={styles.player_controller_wrap}>
            <button
              type="button"
              onClick={() => {
                numVideo > 0 && setNumVideo((prev) => prev - 1);
              }}
            >
              이전
            </button>
            <span>{/* <b>{numVideo + 1} / </b> {courseVideo?.length} */}</span>
            <button
              type="button"
              onClick={() => {
                numVideo + 1 < courseVideo?.length &&
                  setNumVideo((prev) => prev + 1);
              }}
            >
              다음
            </button>
          </div>
          <div className={styles.player_exit}>
            <Link href={`/course/${pageId?.pageId}`}>나가기</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
