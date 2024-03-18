import { Form } from "antd";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "../BoardCommon.module.css";

import { bulletinBoardActions } from "../../../reducers/bulletinboard";

const BulletinBoardCommentsPost = ({ pageId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");

  const onSubmit = useCallback(() => {
    dispatch(
      bulletinBoardActions.addBulletinBoardCommentsRequest({
        post: Number(pageId),
        body: content,
      })
    );
    setContent("");
  }, [content, pageId]);

  const onChangeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  return (
    <>
      <Form onFinish={onSubmit} style={{ position: "relative", zIndex: 5000 }}>
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
      </Form>
    </>
  );
};

export default BulletinBoardCommentsPost;
