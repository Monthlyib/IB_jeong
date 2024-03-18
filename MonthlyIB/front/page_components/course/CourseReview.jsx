import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import CourseReviewItems from "./CourseReviewItems";
import CourseReviewPost from "./CourseReviewPost";

import { useSelector } from "react-redux";

const CourseReview = ({
  pageId,
  reviewAvgPoint,
  reviewPoint,
  courseDetail,
}) => {
  const { User } = useSelector((state) => state.user);
  const [formModal, setFormModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.course_section}>
        <div className={styles.course_tit_header}>
          <h3>수강생 리뷰</h3>
          {User.subscribe && (
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
            리뷰 <span>{courseDetail.reviews?.length}</span>개
          </p>
        </div>

        <div className={styles.review_aver_right}>
          <ul>
            <li>
              <p className={styles.arg_bar}>
                <span style={{ height: `${reviewPoint["1"] * 100}%` }}></span>
              </p>
              <span>1점</span>
            </li>
            <li>
              <p className={styles.arg_bar}>
                <span style={{ height: `${reviewPoint["2"] * 100}%` }}></span>
              </p>
              <span>2점</span>
            </li>
            <li>
              <p className={styles.arg_bar}>
                <span style={{ height: `${reviewPoint["3"] * 100}%` }}></span>
              </p>
              <span>3점</span>
            </li>
            <li>
              <p className={styles.arg_bar}>
                <span style={{ height: `${reviewPoint["4"] * 100}%` }}></span>
              </p>
              <span>4점</span>
            </li>
            <li>
              <p className={styles.arg_bar}>
                <span style={{ height: `${reviewPoint["5"] * 100}%` }}></span>
              </p>
              <span>5점</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.dt_review_wrap}>
        <div className={styles.dt_review_filter}>
          <h5>
            리뷰 <span>{courseDetail.reviews?.length}</span>개
          </h5>
          <div className={styles.dt_review_select}>
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
              coursePostReviewPosts={courseDetail.reviews}
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
