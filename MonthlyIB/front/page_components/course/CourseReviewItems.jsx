import styles from "./CourseDetail.module.css";
import profileImg from "../../assets/img/common/user_profile.jpg";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faStar as regStar } from "@fortawesome/free-regular-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { coursePostActions } from "../../reducers/coursePost";
import Pagination from "../Paginatation";
import shortId from "shortid";

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

  const dispatch = useDispatch();
  const { User, logInDone } = useSelector((state) => state.user);
  const [editStatus, setEditStatus] = useState("");

  const [points, setPoints] = useState(0);
  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const array = [0, 1, 2, 3, 4];
  const reviews = useRef("");

  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(coursePostReviewPosts, currentPage);

  const onClickDelete = useCallback((id) => {
    dispatch(coursePostActions.deleteCourseReviewRequest({ pageId, id }));
  }, []);

  useEffect(() => {
    setPoints(clicked.filter((v) => v === true).length);
  }, [clicked]);

  const onClickEdit = useCallback(
    (content, id) => {
      setEditStatus(id);
      reviews.current = content;
    },
    [editStatus]
  );

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
    (id, c) => {
      let review = "";

      if (typeof reviews.current === "object") {
        review = c;
      } else {
        review = reviews.current;
      }

      dispatch(
        coursePostActions.editCourseReviewRequest({
          pageId,
          id,
          review,
          points,
        })
      );
      setEditStatus("");
    },
    [reviews, points]
  );

  const onClickLike = useCallback((id) => {
    if (logInDone) {
      dispatch(coursePostActions.likeCourseReviewRequest({ pageId, id, User }));
    }
  }, []);
  const onClickUnLike = useCallback((id) => {
    if (logInDone) {
      dispatch(
        coursePostActions.unlikeCourseReviewRequest({ pageId, id, User })
      );
    }
  }, []);

  return (
    <>
      {coursePostReviewPosts?.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.dt_review_item} key={shortId.generate()}>
            <div className={styles.dt_review_top}>
              <div className={styles.dt_review_profile_cont}>
                <figure>
                  <Image src={profileImg} alt="닉네임" />
                </figure>

                <div className={styles.dt_review_profile}>
                  <div className={styles.dt_review_star_cont}>
                    <div className={styles.dt_review_star}>
                      {editStatus === content.id ? (
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
                        starRendering(content.point)
                      )}
                    </div>
                    {editStatus !== content.id && <span> {content.point}</span>}
                  </div>
                  <div className={styles.dt_review_txt}>
                    <span className={styles.dt_review_user}>
                      <b>{content.owner}</b>
                      {`(${content.owner})`}
                    </span>
                    <b> · </b>
                    <span>{content.date}</span>
                  </div>
                </div>
              </div>
              {User.username === content.owner && (
                <div className={styles.comment_option}>
                  <button
                    type="button"
                    onClick={() => {
                      onClickEdit(content.content, content.id);
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClickDelete(content.id);
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            {editStatus === content.id ? (
              <div className={styles.comment_content_wrap}>
                <div className={styles.comment_content_flex}>
                  <textarea
                    type="text"
                    ref={reviews}
                    defaultValue={content.content}
                    onChange={onChangeContent}
                  />
                  <button onClick={() => onSubmit(content.id, content.content)}>
                    등록
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.dt_review_content}>
                  <p>{content.body}</p>
                </div>
                {/* <div className={styles.dt_review_bottom}>
                  {content.heart.find((v) => v.id === User?.id) ? (
                    <button
                      type="button"
                      onClick={() => onClickUnLike(content.id)}
                      className={styles.active}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{content.heart.length}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onClickLike(content.id)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{content.heart.length}</span>
                    </button>
                  )}
                </div> */}
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
