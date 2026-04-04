"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import styles from "./CourseDetail.module.css";

import CourseReviewItems from "./CourseReviewItems";
import CourseReviewPost from "./CourseReviewPost";
import CourseReviewSummary from "./CourseReviewSummary";
import { useUserStore } from "@/store/user";
import { isActiveSubscribe } from "@/utils/subscribeUtils";

const CourseReview = ({
  pageId,
  reviewAvgPoint,
  reviewPoint,
  courseDetail,
}) => {
  const [formModal, setFormModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuClicked, setMenuClicked] = useState({
    recent: true,
    likes: false,
    stars: false,
  });

  const { activeSubscribeInfo, getUserSubscribeInfo } = useUserStore();

  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (!savedUser) return;

    const localUser = JSON.parse(savedUser);
    if (localUser?.state?.userInfo?.userId) {
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
    }
  }, [getUserSubscribeInfo]);

  const filteredReviews = useMemo(() => {
    const reviews = [...(courseDetail?.reply?.data ?? [])];

    if (menuClicked.likes) {
      return reviews.sort(
        (a, b) => (b.voteUserId?.length || 0) - (a.voteUserId?.length || 0)
      );
    }

    if (menuClicked.stars) {
      return reviews.sort((a, b) => (b.star || 0) - (a.star || 0));
    }

    return reviews.sort(
      (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime()
    );
  }, [courseDetail?.reply?.data, menuClicked]);

  return (
    <>
      <div className={styles.course_tit_header}>
        <h3>수강생 리뷰</h3>
        {isActiveSubscribe(activeSubscribeInfo) && (
          <>
            <button
              type="button"
              className={styles.btn_write}
              onClick={() => setFormModal(!formModal)}
            >
              <FontAwesomeIcon icon={faPenAlt} />
              <span>리뷰쓰기</span>
            </button>
            {formModal && (
              <CourseReviewPost setFormModal={setFormModal} pageId={pageId} />
            )}
          </>
        )}
      </div>

      <div className={styles.review_aver}>
        <div className={styles.review_aver_left}>
          <div className={styles.review_aver_point}>
            <FontAwesomeIcon icon={faStar} />
            <b>{reviewAvgPoint.toFixed(1)}</b>
          </div>
          <p>
            리뷰 <span>{courseDetail?.reply?.data?.length || 0}</span>개
          </p>
        </div>
        <CourseReviewSummary reviewPoint={reviewPoint} />
      </div>

      <div className={styles.dt_review_wrap}>
        <div className={styles.dt_review_filter}>
          <h5>
            리뷰 <span>{courseDetail?.reply?.data?.length || 0}</span>개
          </h5>
          <div className={styles.dt_review_select}>
            <button
              type="button"
              className={menuClicked.recent ? styles.active : ""}
              onClick={() =>
                setMenuClicked({ recent: true, likes: false, stars: false })
              }
            >
              최신순
            </button>
            <button
              type="button"
              className={menuClicked.stars ? styles.active : ""}
              onClick={() =>
                setMenuClicked({ recent: false, likes: false, stars: true })
              }
            >
              리뷰평점순
            </button>
            <button
              type="button"
              className={menuClicked.likes ? styles.active : ""}
              onClick={() =>
                setMenuClicked({ recent: false, likes: true, stars: false })
              }
            >
              좋아요순
            </button>
          </div>
        </div>

        <div className={styles.dt_review_cont}>
          <CourseReviewItems
            coursePostReviewPosts={filteredReviews}
            currentPage={currentPage}
            numShowContents={5}
            onPageChange={setCurrentPage}
            pageId={pageId}
          />
        </div>
      </div>
    </>
  );
};

export default CourseReview;
