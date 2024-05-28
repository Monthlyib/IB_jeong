"use client";
import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCirclePlay,
  faVideo,
  faChalkboardUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const CourseDetailRight = ({ courseDetail, reviewAvgPoint, pageId }) => {
  const router = useRouter();

  const onClickEdit = useCallback(() => {}, []);

  const onClickDelete = useCallback(() => {}, []);
  return (
    <div className={styles.course_right}>
      <div className={styles.course_info_cont}>
        <div className={styles.course_info_top}>
          <div className={styles.course_info_tit}>
            <span>{`${courseDetail?.firstCategory?.categoryName} / ${courseDetail?.secondCategory?.categoryName} / ${courseDetail?.thirdCategory?.categoryName}`}</span>
            <p className={styles.course_tit}>{courseDetail.title}</p>

            <div className={styles.course_review_cont}>
              <FontAwesomeIcon icon={faStar} />
              <p>
                {" "}
                {` ${reviewAvgPoint.toFixed(1)}`}{" "}
                <span>{`(${courseDetail.replyCount})`}</span>
              </p>
            </div>
          </div>
          <div className={styles.course_info_etc}>
            <ul>
              <li>
                <FontAwesomeIcon icon={faCirclePlay} />{" "}
                {courseDetail?.duration === ""
                  ? "구독기간동안 무제한 제공"
                  : courseDetail?.duration}
              </li>
              <li>
                <FontAwesomeIcon icon={faVideo} /> {courseDetail.chapterInfo}
              </li>
              <li>
                <FontAwesomeIcon icon={faChalkboardUser} />{" "}
                {courseDetail.instructor}
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.center_btn_wrap}>
          <Link href={`/course/player/${pageId}`}>수강하기</Link>
        </div>

        {/* {User.role === 100 && (
          <>
            <div className={styles.center_btn_wrap_edit}>
              <a onClick={onClickEdit}>수정하기</a>
            </div>
            <div className={styles.center_btn_wrap_delete}>
              <a onClick={onClickDelete}>삭제하기</a>
            </div>
          </>
        )} */}
      </div>
    </div>
  );
};

export default CourseDetailRight;
