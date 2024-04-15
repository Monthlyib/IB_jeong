import { Form } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulletinBoardActions } from "../../../reducers/bulletinboard";
import { useRouter } from "next/router";

import styles from "../BoardCommon.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicEditor = dynamic(() => import("../EditorComponents"), {
  ssr: false,
});

const BulletinBoardPost = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const imageInput = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    // 수정할 때
    if (router.query.edit) {
      setEdit(true);
      setTitle(router.query.prevTitle);
      setContent(router.query.prevContent);
    }
  }, [router.query]);

  const onSubmit = useCallback(() => {
    if (edit) {
      let pageId = router.query.pageId;
      dispatch(
        bulletinBoardActions.editBulletinBoardRequest({
          num: pageId,
          title,
          body: content,
        })
      );
    } else {
      dispatch(
        bulletinBoardActions.addBulletinBoardRequest({
          board: 2,
          title,
          body: content,
        })
      );
    }
    router.push("/board/bulletinboard");
  }, [title, content]);

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);
  const onChangeContent = useCallback((value) => {
    setContent(value);
  }, []);

  const onClickImageUpload = useCallback(() => {
    if (!imageInput.current) {
      return;
    }
    imageInput.current.click();
  }, []);
  console.log(edit);
  return (
    <>
      <main className="width_content">
        <Form onFinish={onSubmit}>
          <div className={styles.write_wrap}>
            <input
              type="text"
              value={title}
              onChange={onChangeTitle}
              className={styles.write_tit}
              placeholder="제목"
            />

            <DynamicEditor
              styleName={styles.write_editor}
              content={content}
              setContent={onChangeContent}
            />

            <div className={styles.write_block}>
              <label>썸네일 등록 ( jpg, png, gif 파일 )</label>
              <input
                type="file"
                accept="image/jpg,impge/png,image/jpeg,image/gif"
                className={styles.write_img}
                onChange={onClickImageUpload}
              />
            </div>
            <div className={styles.write_btn_area}>
              <Link href="/board/bulletinboard" className={styles.cancel}>
                취소
              </Link>
              <button className={styles.submit} type="submit">
                등록
              </button>
            </div>
          </div>
        </Form>
      </main>
    </>
  );
};

export default BulletinBoardPost;
