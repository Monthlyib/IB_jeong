import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCirclePlay,
  faVideo,
  faChalkboardUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const CourseDetailMob = ({ courseDetail, reviewAvgPoint, pageId }) => {
  return (
    <div className={styles.mo_course_info}>
      <div className={styles.course_info_top}>
        <div className={styles.course_info_tit}>
          <span>
            {`${courseDetail?.firstCategory?.categoryName} / ${courseDetail?.secondCategory?.categoryName} / ${courseDetail?.thirdCategory?.categoryName}`}
            {courseDetail.subtitle}
          </span>
          <p className={styles.course_tit}>{courseDetail.title}</p>
          <div className={styles.course_review_cont}>
            <FontAwesomeIcon icon={faStar} />
            <p>
              {reviewAvgPoint}
              <span>{`(${courseDetail.reviews?.length})`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.course_info_etc}>
        <ul style={{ listStyle: "none" }}>
          <li>
            <FontAwesomeIcon icon={faCirclePlay} />
            구독기간동안 무제한 제공
          </li>
          <li>
            <FontAwesomeIcon icon={faVideo} />
            {courseDetail.curriculum?.length} Chapters
          </li>
          <li>
            <FontAwesomeIcon icon={faChalkboardUser} />
            {courseDetail.lecturer}
          </li>
        </ul>
      </div>
      <div className={styles.center_btn_wrap}>
        <Link
          href={{
            pathname: `/player/${pageId}`,
            query: { courseDetail },
          }}
          as={`/player/${pageId}`}
        >
          수강하기
        </Link>
      </div>
    </div>
  );
};

export default CourseDetailMob;
