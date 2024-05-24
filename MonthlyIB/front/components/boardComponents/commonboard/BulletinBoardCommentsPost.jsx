"use client";
import { useCallback, useState } from "react";

import styles from "../BoardCommon.module.css";
import { useSession } from "next-auth/react";
import { useBoardStore } from "@/store/board";

const BulletinBoardCommentsPost = ({ pageId }) => {
  const [content, setContent] = useState("");
  const { data: session } = useSession();
  const { setBoardComment } = useBoardStore();
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setBoardComment(pageId, content, session);
      setContent("");
    },
    [content, pageId]
  );

  const onChangeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  return (
    <>
      <form onSubmit={onSubmit} style={{ position: "relative", zIndex: 0 }}>
        <div className={styles.comment_content_flex}>
          <textarea
            id="comment"
            placeholder="댓글 입력"
            value={content}
            onChange={onChangeContent}
          />
          <button type="submit" id="reply">
            등록
          </button>
        </div>
      </form>
    </>
  );
};

export default BulletinBoardCommentsPost;
