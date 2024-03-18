import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { coursePostActions } from "../../reducers/coursePost";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import CoursePlayerCurriculum from "./CoursePlayerCurriculum";

const CoursePlayer = ({ pageId }) => {
  const dispatch = useDispatch();
  const [numVideo, setNumVideo] = useState(0);
  const [modal, setModal] = useState(false);
  const { courseVideo, courseDetail } = useSelector(
    (state) => state.coursePost
  );

  useEffect(() => {
    dispatch(coursePostActions.getCourseDetailRequest({ num: pageId }));
    dispatch(coursePostActions.getCourseVideoRequest({ num: pageId }));
  }, []);
  console.log(courseVideo[numVideo]?.video);
  return (
    <main className={styles.player_content}>
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
                  curriculum={courseDetail.curriculum}
                  className={styles.course_curri_inner}
                  setNumVideo={setNumVideo}
                />
              </div>
            </div>
          )}
        </nav>

        <div className={styles.player_wrap}>
          <video controls key={courseVideo[numVideo]?.video}>
            <source src={courseVideo[numVideo]?.video} type="video/mp4" />
          </video>
        </div>
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
            <span>
              <b>{numVideo + 1} / </b> {courseVideo?.length}
            </span>
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
            <Link href="/course">나가기</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CoursePlayer;
