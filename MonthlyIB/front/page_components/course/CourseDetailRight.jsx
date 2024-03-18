import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCirclePlay,
  faVideo,
  faChalkboardUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { coursePostActions } from "../../reducers/coursePost";

const CourseDetailRight = ({ courseDetail, reviewAvgPoint, pageId }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { User } = useSelector((state) => state.user);
  const { getCourseDetailDone, deleteCoursePostDone } = useSelector(
    (state) => state.coursePost
  );

  const onClickEdit = useCallback(() => {
    router.push(
      {
        pathname: "/course/write",
        query: {
          edit: true,
          prevTitle: courseDetail.title,
          prevContent: courseDetail.content,
          prevLecturer: courseDetail.lecturer,
          prevSubtitle: courseDetail.subtitle,
          prevCurriculum: JSON.stringify(courseDetail.curriculum),
          pageId,
        },
      },
      "/course/write"
    );
  }, [getCourseDetailDone]);

  const onClickDelete = useCallback(() => {
    dispatch(coursePostActions.deleteCoursePostRequest({ num: pageId }));
    if (deleteCoursePostDone) router.push("/course");
  }, [deleteCoursePostDone]);
  return (
    <div className={styles.course_right}>
      <div className={styles.course_info_cont}>
        <div className={styles.course_info_top}>
          <div className={styles.course_info_tit}>
            {/* <span>{`${courseDetail.group} / ${courseDetail.subject} / ${courseDetail.level}`}</span> */}
            <span>{courseDetail.subtitle}</span>
            <p className={styles.course_tit}>{courseDetail.title}</p>

            <div className={styles.course_review_cont}>
              <FontAwesomeIcon icon={faStar} />
              <p>
                {" "}
                {` ${reviewAvgPoint.toFixed(1)}`}{" "}
                <span>{`(${courseDetail.reviews?.length})`}</span>
              </p>
            </div>
          </div>
          <div className={styles.course_info_etc}>
            <ul>
              <li>
                <FontAwesomeIcon icon={faCirclePlay} /> 구독기간동안 무제한 제공
              </li>
              <li>
                <FontAwesomeIcon icon={faVideo} />{" "}
                {courseDetail.curriculum?.length} Chapters
              </li>
              <li>
                <FontAwesomeIcon icon={faChalkboardUser} />{" "}
                {courseDetail.lecturer}
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.center_btn_wrap}>
          <Link href={`/player/${pageId}`}>수강하기</Link>
        </div>

        {User.role === 100 && (
          <>
            <div className={styles.center_btn_wrap_edit}>
              <a onClick={onClickEdit}>수정하기</a>
            </div>
            <div className={styles.center_btn_wrap_delete}>
              <a onClick={onClickDelete}>삭제하기</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetailRight;
