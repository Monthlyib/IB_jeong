"use client";
import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import CourseReviewItems from "./CourseReviewItems";
import CourseReviewPost from "./CourseReviewPost";
import CourseReviewSummary from "./CourseReviewSummary";
import { useUserStore } from "@/store/user";

const CourseReview = ({
  pageId,
  reviewAvgPoint,
  reviewPoint,
  courseDetail,
}) => {
  const [formModal, setFormModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { userInfo } = useUserStore();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.course_section}>
        <div className={styles.course_tit_header}>
          <h3>수강생 리뷰</h3>
          {userInfo?.userStatus === "ACTIVE" && (
            <button type="button" className={styles.btn_write}>
              <FontAwesomeIcon icon={faPenAlt} />
              <span onClick={() => setFormModal(!formModal)}>리뷰쓰기</span>
              {formModal === true && (
                <CourseReviewPost setFormModal={setFormModal} pageId={pageId} />
              )}
            </button>
          )}
        </div>
      </div>

      <div className={styles.review_aver}>
        <div className={styles.review_aver_left}>
          <div className={styles.review_aver_point}>
            <FontAwesomeIcon icon={faStar} />
            <b>{reviewAvgPoint.toFixed(1)}</b>
          </div>
          <p>
            리뷰 <span>{courseDetail?.replyCount}</span>개
          </p>
        </div>
        <CourseReviewSummary reviewPoint={reviewPoint} />
      </div>

      <div className={styles.dt_review_wrap}>
        <div className={styles.dt_review_filter}>
          <h5>
            리뷰 <span>{courseDetail?.replyCount}</span>개
          </h5>
          <div className={styles.dt_review_select}>
            {/* TODO: click시에 색깔 active 변동 및 기능 구현 */}
            <span data-type="new" className={styles.active}>
              최신순
            </span>
            <span data-type="high">평점 높은순</span>
            <span data-type="good">좋아요순</span>
          </div>
        </div>

        <div className={styles.dt_review_cont}>
          {
            <CourseReviewItems
              coursePostReviewPosts={courseDetail.reply?.data}
              currentPage={currentPage}
              numShowContents={5}
              onPageChange={handlePageChange}
              pageId={pageId}
            />
          }
        </div>
      </div>
    </>
  );
};

export default CourseReview;
