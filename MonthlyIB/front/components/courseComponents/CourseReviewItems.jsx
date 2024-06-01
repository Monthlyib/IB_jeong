"use client";
import styles from "./CourseDetail.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faStar as regStar } from "@fortawesome/free-regular-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "../layoutComponents/Paginatation";
import shortid from "shortid";
import { useSession } from "next-auth/react";
import { useCourseStore } from "@/store/course";

const CourseReviewItems = ({
  coursePostReviewPosts,
  currentPage,
  numShowContents,
  onPageChange,
  pageId,
}) => {
  const starRendering = (star) => {
    const stars = [];
    for (let i = 0; i < star; i++) {
      stars.push(
        <span key={`fill_stars_${i}`}>
          <FontAwesomeIcon icon={faStar} className={styles.fill_stars} />
        </span>
      );
    }

    for (let i = 0; i < 5 - star; i++) {
      stars.push(
        <span key={`empty_stars_${i}`}>
          <FontAwesomeIcon icon={regStar} className={styles.empty_stars} />
        </span>
      );
    }

    return stars;
  };

  const { data: session } = useSession();
  const { deleteCourseReview, reviseCourseReview, voteCourseReview } =
    useCourseStore();
  const [modal, setModal] = useState(-1);

  const [points, setPoints] = useState(0);
  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const array = [0, 1, 2, 3, 4];
  const reviews = useRef("");

  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(coursePostReviewPosts, currentPage);

  const onClickDelete = useCallback((videoLessonsReplyId) => {
    deleteCourseReview(pageId, videoLessonsReplyId, session);
  }, []);

  useEffect(() => {
    setPoints(clicked.filter((v) => v === true).length);
  }, [clicked]);

  const onClickEdit = (content, id) => {
    setModal(id);
    reviews.current = content;
  };

  const onChangeContent = (e) => {
    reviews.current = e.target.value;
  };

  const onStarClick = (index) => {
    let clickStates = [...clicked];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
  };

  const onSubmit = useCallback(
    (videoLessonsReplyId, content) => {
      console.log(typeof reviews.current);
      if (typeof reviews.current === "object") reviews.current = content;
      reviseCourseReview(
        pageId,
        videoLessonsReplyId,
        reviews.current,
        points,
        session
      );
      setModal(-1);
    },
    [reviews, points]
  );

  const onClickLike = (id) => {
    voteCourseReview(pageId, id, session);
  };

  console.log(coursePostReviewPosts);

  return (
    <>
      {coursePostReviewPosts?.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.dt_review_item} key={shortid.generate()}>
            <div className={styles.dt_review_top}>
              <div className={styles.dt_review_profile_cont}>
                <figure>
                  <Image
                    src={
                      session?.userImage === undefined
                        ? "/img/common/user_profile.jpg"
                        : session?.userImage
                    }
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
                          {array.map((el) => (
                            <FontAwesomeIcon
                              key={el}
                              onClick={() => onStarClick(el)}
                              icon={faStar}
                              className={
                                clicked[el] === true
                                  ? styles.active
                                  : styles.empty
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        starRendering(content.star)
                      )}
                    </div>
                    {modal !== content.videoLessonsReplyId && (
                      <span> {content.star}</span>
                    )}
                  </div>
                  <div className={styles.dt_review_txt}>
                    <span className={styles.dt_review_user}>
                      <b>{content.authorNickname}</b>
                      {`(${content.authorUsername})`}
                    </span>
                    <b> · </b>
                    <span>{content.updateAt}</span>
                  </div>
                </div>
              </div>
              {(session?.userId === content.authorId ||
                session?.authority === "ADMIN") && (
                <div className={styles.comment_option}>
                  <button
                    type="button"
                    onClick={() => {
                      onClickEdit(content.content, content.videoLessonsReplyId);
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClickDelete(content.videoLessonsReplyId);
                    }}
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
                  {session?.userStatus === "ACTIVE" && (
                    <button
                      className={
                        content.voteUserId.includes(session?.userId)
                          ? styles.active
                          : ""
                      }
                      type="button"
                      onClick={() => onClickLike(content.videoLessonsReplyId)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{content.voteUserId.length}</span>
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
