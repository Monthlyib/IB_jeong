"use client";

import Image from "next/image";
import shortid from "shortid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regStar } from "@fortawesome/free-regular-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CourseDetail.module.css";

import Pagination from "../layoutComponents/Paginatation";
import { getCookie } from "@/apis/cookies";
import { useCourseStore } from "@/store/course";
import { useUserStore } from "@/store/user";

const CourseReviewItems = ({
  coursePostReviewPosts,
  currentPage,
  numShowContents,
  onPageChange,
  pageId,
}) => {
  const session = getCookie("accessToken");
  const { userInfo } = useUserStore();
  const { deleteCourseReview, reviseCourseReview, voteCourseReview } =
    useCourseStore();
  const [modal, setModal] = useState(-1);
  const [points, setPoints] = useState(0);
  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const reviews = useRef("");
  const starIndex = [0, 1, 2, 3, 4];

  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return (items ?? []).slice(startIndex, startIndex + numShowContents);
  };

  const paginatedPage = paginate(coursePostReviewPosts, currentPage);

  useEffect(() => {
    setPoints(clicked.filter(Boolean).length);
  }, [clicked]);

  const starRendering = (star) => {
    const stars = [];

    for (let i = 0; i < star; i += 1) {
      stars.push(
        <span key={`fill_stars_${i}`}>
          <FontAwesomeIcon icon={faStar} className={styles.fill_stars} />
        </span>
      );
    }

    for (let i = 0; i < 5 - star; i += 1) {
      stars.push(
        <span key={`empty_stars_${i}`}>
          <FontAwesomeIcon icon={regStar} className={styles.empty_stars} />
        </span>
      );
    }

    return stars;
  };

  const onClickDelete = useCallback(
    (videoLessonsReplyId) => {
      deleteCourseReview(pageId, videoLessonsReplyId, { accessToken: session });
    },
    [deleteCourseReview, pageId, session]
  );

  const onClickEdit = (review) => {
    const roundedStar = Math.min(5, Math.max(0, Math.round(review.star || 0)));
    setModal(review.videoLessonsReplyId);
    reviews.current = review.content;
    setClicked(starIndex.map((_, index) => index < roundedStar));
  };

  const onChangeContent = (e) => {
    reviews.current = e.target.value;
  };

  const onStarClick = (index) => {
    const clickStates = starIndex.map((_, itemIndex) => itemIndex <= index);
    setClicked(clickStates);
  };

  const onSubmit = useCallback(
    (videoLessonsReplyId, content) => {
      if (typeof reviews.current === "object") {
        reviews.current = content;
      }

      reviseCourseReview(
        pageId,
        videoLessonsReplyId,
        reviews.current,
        points,
        userInfo
      );
      setModal(-1);
    },
    [pageId, points, reviseCourseReview, userInfo]
  );

  const onClickLike = (id) => {
    voteCourseReview(pageId, id, userInfo);
  };

  return (
    <>
      {coursePostReviewPosts?.length > 0 ? (
        paginatedPage.map((content) => (
          <div
            className={styles.dt_review_item}
            key={
              content.videoLessonsReplyId ||
              `${content.authorId}-${content.updateAt}` ||
              shortid.generate()
            }
          >
            <div className={styles.dt_review_top}>
              <div className={styles.dt_review_profile_cont}>
                <figure>
                  <Image
                    src="/img/common/user_profile.jpg"
                    width="100"
                    height="100"
                    alt="user profile img"
                  />
                </figure>

                <div className={styles.dt_review_profile}>
                  <div className={styles.dt_review_star_cont}>
                    <div className={styles.dt_review_star}>
                      {modal === content.videoLessonsReplyId ? (
                        <div className={styles.review_stars}>
                          {starIndex.map((el) => (
                            <FontAwesomeIcon
                              key={el}
                              onClick={() => onStarClick(el)}
                              icon={faStar}
                              className={
                                clicked[el] ? styles.active : styles.empty
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        starRendering(content.star)
                      )}
                    </div>
                    {modal !== content.videoLessonsReplyId && (
                      <span>{content.star}</span>
                    )}
                  </div>
                  <div className={styles.dt_review_txt}>
                    <span className={styles.dt_review_user}>
                      <b>{content.authorNickname}</b>
                      {`(${content.authorUsername})`}
                    </span>
                    <b>·</b>
                    <span>{content.updateAt}</span>
                  </div>
                </div>
              </div>

              {(userInfo?.userId === content.authorId ||
                userInfo?.authority === "ADMIN") && (
                <div className={styles.comment_option}>
                  <button type="button" onClick={() => onClickEdit(content)}>
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => onClickDelete(content.videoLessonsReplyId)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            {modal === content.videoLessonsReplyId ? (
              <div className={styles.comment_content_wrap}>
                <div className={styles.comment_content_flex}>
                  <textarea
                    type="text"
                    ref={reviews}
                    defaultValue={content.content}
                    onChange={onChangeContent}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onSubmit(content.videoLessonsReplyId, content.content)
                    }
                  >
                    등록
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.dt_review_content}>
                  <p>{content.content}</p>
                </div>
                <div className={styles.dt_review_bottom}>
                  {userInfo?.userStatus === "ACTIVE" && (
                    <button
                      type="button"
                      className={
                        content.voteUserId?.includes(userInfo?.userId)
                          ? styles.active
                          : ""
                      }
                      onClick={() => onClickLike(content.videoLessonsReplyId)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{content.voteUserId?.length || 0}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div className={styles.review_no}>
          <p>리뷰가 없습니다.</p>
        </div>
      )}

      {coursePostReviewPosts?.length > 0 && (
        <Pagination
          contents={coursePostReviewPosts}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default CourseReviewItems;
