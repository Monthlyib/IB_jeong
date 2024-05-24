"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "../BoardCommon.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { boardPost, boardReviseItem } from "@/api/boardAPI";
import { useSession } from "next-auth/react";
import { useBoardStore } from "@/store/board";

const DynamicEditor = dynamic(
  () => import("@/components/boardComponents/EditorComponents"),
  {
    ssr: false,
  }
);

const BulletinBoardPost = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const boardId = searchParams.get("boardId");
  const { boardDetail } = useBoardStore();

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (type === "write") boardPost(title, content, session);
      else if (type === "revise")
        boardReviseItem(boardId, title, content, session);
      router.push("/board/free");
    },
    [title, content]
  );
  useEffect(() => {
    if (boardId) {
      setTitle(boardDetail.title);
      setContent(boardDetail.content);
    }
  }, []);
  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);
  const onChangeContent = useCallback((v) => {
    setContent(v);
  }, []);

  return (
    <>
      <main className="width_content">
        <form onSubmit={onSubmit}>
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

            <div className={styles.write_block}></div>
            <div className={styles.write_btn_area}>
              <Link href="/board/free" className={styles.cancel}>
                취소
              </Link>
              <button className={styles.submit} type="submit">
                등록
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default BulletinBoardPost;
