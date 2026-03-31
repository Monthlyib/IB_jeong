"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CourseDetail.module.css";

import CourseCurriculum from "./CourseCurriculum";
import CourseDetailMob from "./CourseDetailMob";
import CourseDetailRight from "./CourseDetailRight";
import CourseReview from "./CourseReview";
import { useCourseStore } from "@/store/course";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const CourseDetail = ({ pageId }) => {
  const [modal, setModal] = useState(1);
  const { courseDetail, getCourseDetail } = useCourseStore();

  const courseContent = useRef(null);
  const courseCurriculum = useRef(null);
  const courseReview = useRef(null);

  const reviewData = courseDetail?.reply?.data ?? [];

  const reviewStats = useMemo(() => {
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    if (reviewData.length === 0) {
      return { average: 0, distribution, count: 0 };
    }

    const total = reviewData.reduce((sum, item) => {
      const score = Number(item.star) || 0;
      const roundedScore = Math.min(5, Math.max(1, Math.round(score)));
      distribution[roundedScore] += 1;
      return sum + score;
    }, 0);

    Object.keys(distribution).forEach((key) => {
      distribution[key] = distribution[key] / reviewData.length;
    });

    return {
      average: total / reviewData.length,
      distribution,
      count: reviewData.length,
    };
  }, [reviewData]);

  const categoryPath = [
    courseDetail?.firstCategory?.categoryName,
    courseDetail?.secondCategory?.categoryName,
    courseDetail?.thirdCategory?.categoryName,
  ]
    .filter(Boolean)
    .join(" / ");

  const courseSummary = useMemo(() => {
    const plainText = stripHtml(courseDetail?.content);
    return plainText.length > 160
      ? `${plainText.slice(0, 160).trim()}...`
      : plainText;
  }, [courseDetail?.content]);

  const scrollToSection = (sectionRef, tabIndex) => {
    const target = sectionRef.current;
    if (!target) return;

    const stickyOffset = 160;
    const top = target.getBoundingClientRect().top + window.scrollY - stickyOffset;
    window.scrollTo({ top, behavior: "smooth" });
    setModal(tabIndex);
  };

  useEffect(() => {
    if (pageId) {
      getCourseDetail(pageId);
    }
  }, [getCourseDetail, pageId]);

  return (
    <main className={`width_content ${styles.coursePage}`}>
      <div className={styles.course_detail_wrap}>
        <div className={styles.course_left}>
          <section className={styles.courseHero}>
            <figure className={styles.course_thumbnail}>
              <Image
                src={
                  courseDetail?.videoLessonsIbThumbnailUrl
                    ? courseDetail.videoLessonsIbThumbnailUrl
                    : "/img/common/user_profile.jpg"
                }
                width="100"
                height="100"
                alt="강의 표지 사진"
              />
            </figure>

            <div className={styles.courseHeroCard}>
              <span className={styles.courseHeroLabel}>MONTHLY IB COURSE</span>
              <h1 className={styles.courseHeroTitle}>{courseDetail?.title}</h1>
              {courseSummary && (
                <p className={styles.courseHeroSummary}>{courseSummary}</p>
              )}

              <div className={styles.courseHeroMeta}>
                {categoryPath && (
                  <span className={styles.courseMetaChip}>{categoryPath}</span>
                )}
                {courseDetail?.instructor && (
                  <span className={styles.courseMetaChip}>
                    Instructor {courseDetail.instructor}
                  </span>
                )}
                {courseDetail?.chapterInfo && (
                  <span className={styles.courseMetaChip}>
                    {courseDetail.chapterInfo}
                  </span>
                )}
                <span className={styles.courseMetaChip}>
                  리뷰 {reviewStats.count}개
                </span>
              </div>
            </div>
          </section>

          <CourseDetailMob
            courseDetail={courseDetail}
            reviewAvgPoint={reviewStats.average}
            reviewCount={reviewStats.count}
            pageId={pageId}
          />

          <nav className={styles.course_nav}>
            <ul>
              <li className={modal === 1 ? styles.active : ""}>
                <button
                  type="button"
                  onClick={() => scrollToSection(courseContent, 1)}
                >
                  과정소개
                </button>
              </li>
              <li className={modal === 2 ? styles.active : ""}>
                <button
                  type="button"
                  onClick={() => scrollToSection(courseCurriculum, 2)}
                >
                  커리큘럼
                </button>
              </li>
              <li className={modal === 3 ? styles.active : ""}>
                <button
                  type="button"
                  onClick={() => scrollToSection(courseReview, 3)}
                >
                  수강후기
                </button>
              </li>
            </ul>
          </nav>

          <div className={styles.mi_course}>
            <section
              ref={courseContent}
              className={`${styles.course_content} ${styles.course_section} ${styles.course_sectionCard}`}
            >
              <div className={styles.course_tit_header}>
                <h3>과정소개</h3>
              </div>
              <div
                className={styles.course_contentInner}
                dangerouslySetInnerHTML={{
                  __html: courseDetail?.content ?? "",
                }}
              />
            </section>

            <section
              ref={courseCurriculum}
              className={`${styles.course_section} ${styles.course_sectionCard}`}
            >
              <div className={styles.course_tit_header}>
                <h3>커리큘럼</h3>
              </div>

              <div className={styles.course_curri_wrap}>
                <CourseCurriculum curriculum={courseDetail} />
              </div>
            </section>

            <section
              ref={courseReview}
              className={`${styles.course_section} ${styles.course_sectionCard}`}
            >
              <CourseReview
                pageId={pageId}
                reviewAvgPoint={reviewStats.average}
                reviewPoint={reviewStats.distribution}
                courseDetail={courseDetail}
              />
            </section>
          </div>
        </div>

        <CourseDetailRight
          courseDetail={courseDetail}
          reviewAvgPoint={reviewStats.average}
          reviewCount={reviewStats.count}
          pageId={pageId}
          categoryPath={categoryPath}
        />
      </div>
    </main>
  );
};

export default CourseDetail;
