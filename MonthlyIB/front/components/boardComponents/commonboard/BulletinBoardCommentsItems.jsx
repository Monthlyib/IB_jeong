import styles from "../BoardCommon.module.css";
import profileImg from "../../../assets/img/common/user_profile.jpg";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulletinBoardActions } from "../../../reducers/bulletinboard";
import Pagination from "../../Paginatation";

const BulletinBoardCommentsItems = ({
  bulletinBoardComments,
  currentPage,
  numShowContents,
  onPageChange,
  pageId,
}) => {
  const dispatch = useDispatch();

  const { User, logInDone } = useSelector((state) => state.user);
  const [editStatus, setEditStatus] = useState("");
  const comments = useRef("");

  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(bulletinBoardComments, currentPage);

  const onClickDelete = useCallback((num) => {
    dispatch(
      bulletinBoardActions.deleteBulletinBoardCommentsRequest({ pageId, num })
    );
  }, []);

  const onClickEdit = useCallback(
    (content, num) => {
      setEditStatus(num);
      comments.current = content;
    },
    [editStatus]
  );

  const onChangeContent = useCallback(
    (e) => {
      comments.current = e.target.value;
    },
    [comments]
  );

  const onSubmit = useCallback(
    (num, c) => {
      let content = "";

      if (typeof comments.current === "object") {
        content = c;
      } else {
        content = comments.current;
      }
      dispatch(
        bulletinBoardActions.editBulletinBoardCommentsRequest({
          pageId,
          num,
          content,
        })
      );
      setEditStatus("");
    },
    [comments]
  );

  const onClickLike = useCallback((id) => {
    if (logInDone) {
      dispatch(
        bulletinBoardActions.likeBulletinBoardCommentsRequest({
          pageId,
          id,
          User,
        })
      );
    }
  }, []);
  const onClickUnLike = useCallback((id) => {
    if (logInDone) {
      dispatch(
        bulletinBoardActions.unlikeBulletinBoardCommentsRequest({
          pageId,
          id,
          User,
        })
      );
    }
  }, []);
  return (
    <>
      {bulletinBoardComments.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.comment_item} key={content.num}>
            <div className={styles.comment_top}>
              <div className={styles.comment_profile_cont}>
                <figure>
                  <Image src={profileImg} alt="닉네임" />
                </figure>

                <div className={styles.comment_profile}>
                  <div className={styles.comment_txt}>
                    <span className={styles.comment_user}>
                      <b>{content.owner_name}</b>
                      {`(${content.owner})`}
                    </span>
                    <b> · </b>
                    <span className={styles.comment_date}>{content.time}</span>
                  </div>
                </div>
              </div>
              {User.num === content.owner && (
                <div className={styles.comment_option}>
                  <button
                    type="button"
                    onClick={() => {
                      onClickEdit(content.comment, content.num);
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClickDelete(content.num);
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            {editStatus === content.num ? (
              <div className={styles.comment_content_wrap}>
                <div className={styles.comment_content_flex}>
                  <textarea
                    type="text"
                    ref={comments}
                    defaultValue={comments.current}
                    onChange={onChangeContent}
                  />
                  <button
                    onClick={() => onSubmit(content.num, content.comment)}
                  >
                    등록
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.comment_content}>
                  <p>{content.comment}</p>
                </div>
                <div className={styles.comment_bottom}>
                  {/* {content.heart.find((v) => v.id === User?.id) ? (
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
                  )} */}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div className={styles.review_no}>
          <p>댓글이 없습니다.</p>
        </div>
      )}
      {bulletinBoardComments.length > 0 && (
        <Pagination
          contents={bulletinBoardComments}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};
export default BulletinBoardCommentsItems;
