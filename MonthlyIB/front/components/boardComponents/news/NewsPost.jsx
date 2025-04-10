"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import dynamic from "next/dynamic";
import styles from "../BoardCommon.module.css";
import Link from "next/link";
import { useNewstore } from "@/store/news";
import { useUserInfo } from "@/store/user";
import { get } from "lodash";


const DynamicEditor = dynamic(
  () => import("@/components/boardComponents/EditorComponents"),
  {
    ssr: false,
  }
);
const NewsPost = () => {
  const router = useRouter();
  const imageInput = useRef();
  const { newsDetail, postNews, reviseNews, getNewsList } = useNewstore();
  const [title, setTitle] = useState("");
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const newsId = searchParams.get("newsId");
  const [content, setContent] = useState("");
  const { userInfo } = useUserInfo();

  const onSubmit = useCallback(
    async(e) => {
      e.preventDefault();
      if (type === "write")
        { 
          postNews(title, content, userInfo);
          getNewsList(1,"");
        }
      else if (type === "revise") {
        reviseNews(newsId, title, content, userInfo);
        getNewsList(1, "");
      }
        router.push("/board");
    },
    [title, content]
  );

  useEffect(() => {
    if (newsId) {
      setTitle(newsDetail.title);
      setContent(newsDetail.content);
    }
  }, []);

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onChangeContent = useCallback((v) => {
    setContent(v);
  }, []);
  const onClickImageUpload = useCallback(() => {
    if (!imageInput.current) {
      return;
    }
    imageInput.current.click();
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
              placeholder="IB 입시뉴스 제목을 입력하세요!"
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
              <Link href="/board" className={styles.cancel}>
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

export default NewsPost;
