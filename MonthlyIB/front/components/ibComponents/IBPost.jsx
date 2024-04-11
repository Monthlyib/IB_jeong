"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import styles from "./IbComponents.module.css";
import Link from "next/link";

const IBPost = () => {
  const imageInput = useRef();
  const fileInput = useRef();
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/monthly-ib`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: session?.accessToken,
            },
            body: JSON.stringify({
              title,
              content: "dummy",
            }),
          }
        );
        if (res.ok) {
          router.push("/ib");
          console.log("hi");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [title]
  );

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
        <form onSubmit={onSubmitForm}>
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
        </form>
      </main>
    </>
  );
};

export default IBPost;
