"use client";
import styles from "./CourseDetail.module.css";
import { useEffect, useRef, useState } from "react";

import CourseCurriculum from "./CourseCurriculum";
import CourseReview from "./CourseReview";
import CourseDetailMob from "./CourseDetailMob";
import CourseDetailRight from "./CourseDetailRight";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCourseStore } from "@/store/course";
import Image from "next/image";

const reviewPoint = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

const CourseDetail = (pageId) => {
  const router = useRouter();
  const [modal, setModal] = useState(1);
  const [modalFixed, setModalFixed] = useState(false);
  const [reviewAvgPoint, setReviewAvgPoint] = useState(0);
  const [reviewStarHeight, setReviewStarHeight] = useState({});
  let reviewValHolder = 0;

  const { data: session } = useSession();
  const { courseDetail, getCourseDetail } = useCourseStore();

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
    getCourseDetail(pageId?.pageId);
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
    if (courseDetail.reply?.data.length > 0) {
      for (let i = 0; i < courseDetail.reviews.length; i++) {
        reviewValHolder += Number(courseDetail.reply?.data[i].star);
        reviewPoint[String(courseDetail.reply?.data[i].star)] += 1;
      }
      for (let i = 1; i < 6; i++) {
        reviewPoint[String(i)] =
          reviewPoint[String(i)] / courseDetail.reply?.data.length;
      }
      reviewValHolder = reviewValHolder / courseDetail.reply?.data.length;
      setReviewAvgPoint(reviewValHolder);
    }
    setReviewStarHeight(reviewPoint);
  }, [courseDetail.reply?.data]);

  return (
    <>
      <main className="width_content">
        <div className={styles.course_detail_wrap}>
          <div className={styles.course_left}>
            <div className={styles.course_top}>
              <figure className={styles.course_thumbnail}>
                <Image
                  src={
                    courseDetail?.videoLessonsIbThumbnailUrl !== ""
                      ? courseDetail?.videoLessonsIbThumbnailUrl
                      : "/img/common/user_profile.jpg"
                  }
                  width="100"
                  height="100"
                  alt="강의 표지 사진"
                />
              </figure>
              <CourseDetailMob
                courseDetail={courseDetail}
                reviewAvgPoint={reviewAvgPoint}
                pageId={pageId?.pageId}
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
                  className={`${styles.course_section}`}
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
                    pageId={pageId?.pageId}
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
            pageId={pageId?.pageId}
          />
        </div>
      </main>
    </>
  );
};

export default CourseDetail;
