"use client";
import styles from "./CourseDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [filteredCourseDetail, setFilteredCourseDetail] = useState({});

  const [menuClicked, setMenuClicked] = useState({
    recent: true,
    likes: false,
    stars: false,
  });

  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore();
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    if (localUser)
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
  }, []);
  const onClickRecent = () => {
    setMenuClicked({ recent: true, likes: false, stars: false });
  };

  const onClickLikes = () => {
    setMenuClicked({ recent: false, likes: true, stars: false });
  };

  const onClickStars = () => {
    setMenuClicked({ recent: false, likes: false, stars: true });
  };
  useEffect(() => {
    if (menuClicked.recent) {
      const temp = { ...courseDetail };
      const test = temp.reply?.data.sort((a, b) => {
        return new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime();
      });
      setFilteredCourseDetail({ ...temp, reply: { data: test } });
    } else if (menuClicked.likes) {
      const temp = { ...courseDetail };
      const test = temp.reply.data.sort((a, b) => {
        return b.voteUserId.length - a.voteUserId.length;
      });
      setFilteredCourseDetail({ ...temp, reply: { data: test } });
    } else if (menuClicked.stars) {
      const temp = { ...courseDetail };
      const test = temp.reply.data.sort((a, b) => {
        return b.star - a.star;
      });
      setFilteredCourseDetail({ ...temp, reply: { data: test } });
    }
  }, [courseDetail?.reply?.data, menuClicked]);

  return (
    <>
      <div className={styles.course_section}>
        <div className={styles.course_tit_header}>
          <h3>수강생 리뷰</h3>
          {userSubscribeInfo?.[0]?.subscribeStatus === "WAIT" && (
            <button type="button" className={styles.btn_write}>
              <FontAwesomeIcon icon={faPenAlt} />
              <span onClick={() => setFormModal(!formModal)}>리뷰쓰기</span>
            </button>
          )}
          {formModal === true && (
            <CourseReviewPost setFormModal={setFormModal} pageId={pageId} />
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
            리뷰 <span>{courseDetail?.reply?.data?.length}</span>개
          </p>
        </div>
        <CourseReviewSummary reviewPoint={reviewPoint} />
      </div>

      <div className={styles.dt_review_wrap}>
        <div className={styles.dt_review_filter}>
          <h5>
            리뷰 <span>{courseDetail?.reply?.data?.length}</span>개
          </h5>
          <div className={styles.dt_review_select}>
            <button
              className={menuClicked.recent === true ? styles.active : ""}
              onClick={onClickRecent}
            >
              최신순
            </button>
            <button
              className={menuClicked.stars === true ? styles.active : ""}
              onClick={onClickStars}
            >
              리뷰평점순
            </button>
            <button
              className={menuClicked.likes === true ? styles.active : ""}
              onClick={onClickLikes}
            >
              좋아요순
            </button>
          </div>
        </div>

        <div className={styles.dt_review_cont}>
          {
            <CourseReviewItems
              coursePostReviewPosts={filteredCourseDetail.reply?.data}
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
