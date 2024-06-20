"use client";
import styles from "../BoardCommon.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useRef, useState } from "react";
import Pagination from "@/components/layoutComponents/Paginatation";
import shortid from "shortid";
import { useBoardStore } from "@/store/board";
import { useUserStore } from "@/store/user";

const BulletinBoardCommentsItems = ({
  bulletinBoardComments,
  currentPage,
  numShowContents,
  onPageChange,
  pageId,
}) => {
  const [editModal, setEditModal] = useState(false);
  const comments = useRef("");
  const { deleteBoardComment, reviseBoardComment, voteReply } = useBoardStore();
  const { userInfo } = useUserStore();

  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(bulletinBoardComments, currentPage);

  const onClickDelete = async (boardReplyId) => {
    deleteBoardComment(boardReplyId, userInfo, pageId, currentPage);
  };

  const onClickEdit = (content) => {
    comments.current = content;
    setEditModal(!editModal);
  };

  const onChangeContent = useCallback(
    (e) => {
      comments.current = e.target.value;
    },
    [comments]
  );

  const onSubmit = (boardReplyId, c) => {
    let content = "";

    if (typeof comments.current === "object") {
      content = c;
    } else {
      content = comments.current;
    }
    reviseBoardComment(boardReplyId, content, userInfo, pageId, currentPage);
    setEditModal(!editModal);
  };

  const onClickLike = (boardReplyId) => {
    if (userInfo?.userStatus === "ACTIVE") {
      voteReply(pageId, currentPage, boardReplyId, userInfo);
    }
    console.log(bulletinBoardComments);
  };
  return (
    <>
      {bulletinBoardComments?.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.comment_item} key={shortid.generate()}>
            <div className={styles.comment_top}>
              <div className={styles.comment_profile_cont}>
                <figure>
                  <Image
                    src={
                      userInfo?.userImage === undefined
                        ? "/img/common/user_profile.jpg"
                        : userInfo?.userImage
                    }
                    width="100"
                    height="100"
                    alt="닉네임"
                  />
                </figure>

                <div className={styles.comment_profile}>
                  <div className={styles.comment_txt}>
                    <span className={styles.comment_user}>
                      <b>{content.authorNickname}</b>
                      {`(${content.authorUsername})`}
                    </span>
                    <b> · </b>
                    <span className={styles.comment_date}>
                      {content.createAt.split("T")[0]}&nbsp;
                      {content.createAt.split("T")[1]}
                    </span>
                  </div>
                </div>
              </div>
              {userInfo?.username === content.authorUsername && (
                <div className={styles.comment_option}>
                  <button
                    type="button"
                    onClick={() => {
                      onClickEdit(content.content);
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClickDelete(content.boardReplyId);
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            {editModal === true ? (
              <div className={styles.comment_content_wrap}>
                <div className={styles.comment_content_flex}>
                  <textarea
                    type="text"
                    ref={comments}
                    defaultValue={comments.current}
                    onChange={onChangeContent}
                  />
                  <button
                    onClick={() =>
                      onSubmit(content.boardReplyId, content.content)
                    }
                  >
                    등록
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.comment_content}>
                  <p>{content.content}</p>
                </div>
                <div className={styles.comment_bottom}>
                  {content.voteUserId.find((v) => v === userInfo?.userId) ? (
                    <button
                      type="button"
                      onClick={() => onClickLike(content.boardReplyId)}
                      className={styles.active}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{content.voterCount}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onClickLike(content.boardReplyId)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{content.voterCount}</span>
                    </button>
                  )}
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
      {bulletinBoardComments?.length > 0 && (
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
