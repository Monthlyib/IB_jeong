"use client";
import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import CoursePlayerCurriculum from "./CoursePlayerCurriculum";
import { useCourseStore } from "@/store/course";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";

const CoursePlayer = (pageId) => {
  const router = useRouter();
  const [chapterNum, setChapterNum] = useState(0);
  const [subChapterNum, setSubChapterNum] = useState(0);
  const [modal, setModal] = useState(false);
  const { courseDetail, getCourseDetail } = useCourseStore();
  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore();

  
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    if (localUser)
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
  }, []);


  useEffect(() => {
    if (userSubscribeInfo?.[0]?.subscribeStatus !== "ACTIVE") {
      alert("잘못된 접근입니다.");
      router.back();
    }
    getCourseDetail(pageId?.pageId);
  }, []);

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
                <h3>{courseDetail?.title}</h3>
              </div>

              <div className={styles.course_curri_wrap}>
                <CoursePlayerCurriculum
                  curriculum={courseDetail.chapters}
                  className={styles.course_curri_inner}
                  setChapterNum={setChapterNum}
                  subChapterNum={subChapterNum}
                  setSubChapterNum={setSubChapterNum}
                />
              </div>
            </div>
          )}
        </nav>

        {Object.keys(courseDetail).length > 0 ? (
          <div className={styles.player_wrap}>
            <iframe
              width={"100%"}
              height={"100%"}
              src={
                "https://www.youtube.com/embed/" +
                courseDetail?.chapters[chapterNum]?.subChapters[
                  subChapterNum
                ]?.videoFileUrl.split("/")[
                  courseDetail?.chapters[chapterNum].subChapters[
                    subChapterNum
                  ]?.videoFileUrl.split("/").length - 1
                ]
              }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
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
                subChapterNum > 0 && setSubChapterNum((prev) => prev - 1);
              }}
            >
              이전
            </button>
            <span>{/* <b>{numVideo + 1} / </b> {courseVideo?.length} */}</span>
            <button
              type="button"
              onClick={() => {
                subChapterNum + 1 <
                  courseDetail?.chapters[chapterNum]?.subChapters?.length &&
                  setSubChapterNum((prev) => prev + 1);
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
