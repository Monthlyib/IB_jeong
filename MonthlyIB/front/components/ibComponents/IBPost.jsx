import { Form } from "antd";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ibPostActions } from "../../reducers/ibpost";
import { useRouter } from "next/router";

import styles from "./IbComponents.module.css";
import Link from "next/link";

const IBPost = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const imageInput = useRef();
  const fileInput = useRef();
  const [title, setTitle] = useState("");

  const onSubmit = useCallback(() => {
    dispatch(
      ibPostActions.addIBPostRequest({
        title,
        image: imageInput.current,
        file: fileInput.current,
      })
    );
    router.push("/ib");
  }, [title]);

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onClickImageUpload = useCallback((e) => {
    imageInput.current = e.target.files[0];
  }, []);

  const onClickFileUpload = useCallback((e) => {
    fileInput.current = e.target.files[0];
  }, []);

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
              placeholder="월간 IB 제목을 입력하세요!"
            />
          </div>
          <div className={styles.write_block}>
            <label>썸네일 등록 ( jpg, png, gif 파일 )</label>
            <input
              type="file"
              accept="image/jpg,image/png,image/jpeg,image/gif"
              className={styles.write_img}
              onChange={onClickImageUpload}
            />
          </div>
          <div className={styles.write_block}>
            <label>PDF 업로드 ( pdf 파일 )</label>
            <input
              type="file"
              accept="application/pdf"
              className={styles.write_file}
              onChange={onClickFileUpload}
            />
          </div>
          <div className={styles.write_btn_area}>
            <Link href="/ib" className={styles.cancel}>
              취소
            </Link>
            <button className={styles.submit} type="submit">
              등록
            </button>
          </div>
        </Form>
      </main>
    </>
  );
};

export default IBPost;
