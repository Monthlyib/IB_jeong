import styles from "./CourseDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import CourseCurriculum from "./CourseCurriculum";
import CourseReview from "./CourseReview";
import CourseDetailMob from "./CourseDetailMob";
import CourseDetailRight from "./CourseDetailRight";
import { useRouter } from "next/router";
import { coursePostActions } from "../../reducers/coursePost";

const reviewPoint = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

const CourseDetail = ({ pageId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { User } = useSelector((state) => state.user);
  const { courseDetail } = useSelector((state) => state.coursePost);
  const [modal, setModal] = useState(1);
  const [modalFixed, setModalFixed] = useState(false);
  const [reviewAvgPoint, setReviewAvgPoint] = useState(0);
  const [reviewStarHeight, setReviewStarHeight] = useState({});
  let reviewValHolder = 0;

  const courseContent = useRef();
  const courseCurriculum = useRef();
  const courseReivew = useRef();

  const onClickCourseContent = () => {
    courseContent.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onClickCourseCurriculum = () => {
    courseCurriculum.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onClickCourseReview = () => {
    courseReivew.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(coursePostActions.getCourseDetailRequest({ num: pageId }));
  }, []);

  // 어느정도 스크롤 후에 과정소개, 커리큘럼, 리뷰 모달 고정용
  useEffect(() => {
    const onScrollEvent = () => {
      if (window.scrollY > document.documentElement.scrollHeight * 0.2) {
        setModalFixed(true);
      } else {
        setModalFixed(false);
      }
    };
    window.addEventListener("scroll", onScrollEvent);

    return () => {
      window.removeEventListener("scroll", onScrollEvent);
    };
  }, [modalFixed]);

  useEffect(() => {
    if (courseDetail.reviews?.length > 0) {
      for (let i = 0; i < courseDetail.reviews.length; i++) {
        reviewValHolder += Number(courseDetail.reviews[i].star);
        reviewPoint[String(courseDetail.reviews[i].star)] += 1;
      }
      for (let i = 1; i < 6; i++) {
        reviewPoint[String(i)] =
          reviewPoint[String(i)] / courseDetail.reviews.length;
      }
      reviewValHolder = reviewValHolder / courseDetail.reviews.length;
      setReviewAvgPoint(reviewValHolder);
    }
    setReviewStarHeight(reviewPoint);
  }, [courseDetail.reviews]);

  return (
    <>
      <main className="width_content">
        <div className={styles.course_detail_wrap}>
          <div className={styles.course_left}>
            <div className={styles.course_top}>
              <figure className={styles.course_thumbnail}>
                <img src={courseDetail?.Image?.src} alt="cover Image" />
              </figure>
              <CourseDetailMob
                courseDetail={courseDetail}
                reviewAvgPoint={reviewAvgPoint}
                pageId={pageId}
              />
              <nav
                className={styles.course_nav}
                style={
                  modalFixed === true
                    ? { position: "fixed", top: 0, zIndex: 999 }
                    : { position: "relative" }
                }
              >
                <ul>
                  <li
                    className={modal === 1 ? styles.active : ""}
                    onClick={() => setModal(1)}
                  >
                    <span onClick={onClickCourseContent}>과정소개</span>
                  </li>
                  <li
                    className={modal === 2 ? styles.active : ""}
                    onClick={() => setModal(2)}
                  >
                    <span onClick={onClickCourseCurriculum}>커리큘럼</span>
                  </li>
                  <li
                    className={modal === 3 ? styles.active : ""}
                    onClick={() => setModal(3)}
                  >
                    <span onClick={onClickCourseReview}>수강후기</span>
                  </li>
                </ul>
              </nav>
              <div className={styles.mi_course}>
                <div
                  className={`${styles.course_content} ${styles.course_section}`}
                  ref={courseContent}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: courseDetail.content,
                    }}
                  ></p>
                </div>

                <div
                  className={`${styles.course_curriculum} ${styles.course_section}`}
                  ref={courseCurriculum}
                >
                  <div className={styles.course_tit_header}>
                    <h3>커리큘럼</h3>
                  </div>

                  <div className={styles.course_curri_wrap}>
                    <CourseCurriculum curriculum={courseDetail} />
                  </div>
                </div>
                <div ref={courseReivew} style={{ marginTop: 50 }} className="">
                  <CourseReview
                    pageId={pageId}
                    reviewAvgPoint={reviewAvgPoint}
                    reviewPoint={reviewStarHeight}
                    courseDetail={courseDetail}
                  />
                </div>
              </div>
            </div>
          </div>
          <CourseDetailRight
            courseDetail={courseDetail}
            reviewAvgPoint={reviewAvgPoint}
            pageId={pageId}
          />
        </div>
      </main>
    </>
  );
};

export default CourseDetail;
