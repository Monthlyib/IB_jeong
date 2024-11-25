"use client";
import styles from "../BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faPenAlt,
  faTrashAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import shortid from "shortid";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useNewstore } from "@/store/news";
import { newsDeleteItem } from "@/apis/newsAPI";
import { useUserStore } from "@/store/user";
import { getCookie } from "@/apis/cookies";
import Loading from "../../Loading";
import { get } from "lodash";

const NewsDetail = (pageId) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("currentPage");
  const userId = searchParams.get("userId");
  const session = getCookie("accessToken");
  const { getUserInfo, userDetailInfo } = useUserStore();
  const { newsDetail, getNewsDetail, newsList, getNewsList, PageInfo,loading } = useNewstore();
  const currentIndex = newsList.findIndex(
    (v) => v.newsId === parseInt(pageId?.pageId)
  );

  const currentPageInt = parseInt(currentPage);

  const onClickDelete = useCallback(() => {
    newsDeleteItem(parseInt(pageId?.pageId), { accessToken: session });
    getNewsList(currentPageInt, "");
    router.push("/board");
  }, []);

  useEffect(() => {
    getUserInfo(userId, { accessToken: session });

    getNewsDetail(parseInt(pageId?.pageId), { accessToken: session });
    // getNewsList(currentPage);
  }, []);
  const onClickEdit = useCallback(() => {
    router.push(`/board/newswrite?type=revise&newsId=${pageId.pageId}`);
  }, []);

  if(loading){
    return <Loading />
  }

  return (
    <>
      <main className="width_content">
        <div className={styles.read_wrap}>
          <div className={styles.read_cont}>
            <div className={styles.read_left}>
              <Link
                href="/board/"
                className={`${styles.read_btn} ${styles.list}`}
              >
                <FontAwesomeIcon icon={faBars} />
              </Link>
            </div>
            <div className={styles.read_center}>
              <div className={styles.read_header}>
                <h3>{newsDetail.title}</h3>
                <div className={styles.read_info_label}>
                  <span>{newsDetail.authorUsername}</span>
                  <b>·</b>
                  <span>{newsDetail.createAt}</span>
                  <b>·</b>
                  <span>{newsDetail.viewCount}</span>
                </div>
              </div>

              <div className={styles.read_content}>
                <div className={styles.file_wrap}>
                  <ul style={{ listStyle: "none" }}>
                    {newsDetail?.files?.length > 0 &&
                      newsDetail.files.map((f) => (
                        <li key={shortid.generate()}>
                          <a href={f.fileUrl} download>
                            <FontAwesomeIcon icon={faFile} />
                            <span>{f.fileName}</span>
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className={styles.title}>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: newsDetail.content,
                    }}
                  ></p>
                </div>
              </div>
              <div className={styles.read_btn_area}>
                {/* 이전 버튼 */}
                <Link
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();

                    if (currentIndex === 0 && currentPageInt > 1) {
                      // 이전 페이지로 이동하기 위해 데이터 가져오기
                      await getNewsList(currentPageInt - 1, ""); // 상태 업데이트 대기
                      const updatedNewsList = useNewstore.getState().newsList; // 최신 상태 가져오기
                      router.push(
                        `/board/${updatedNewsList[updatedNewsList.length - 1]?.newsId}?currentPage=${currentPageInt - 1
                        }&userId=${userDetailInfo.userId}`
                      );
                    } else if (newsList[currentIndex - 1]?.newsId !== undefined) {
                      // 현재 페이지 내에서 이동
                      router.push(
                        `/board/${newsList[currentIndex - 1]?.newsId}?currentPage=${currentPageInt}&userId=${userDetailInfo.userId}`
                      );
                    }
                  }}
                  className={
                    currentIndex === 0 && currentPageInt === 1
                      ? styles.disabled
                      : ""
                  }
                >
                  이전
                </Link>

                {/* 다음 버튼 */}
                <Link
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();

                    if (
                      currentIndex === newsList.length - 1 &&
                      currentPageInt < PageInfo.totalPages
                    ) {
                      // 다음 페이지로 이동하기 위해 데이터 가져오기
                      await getNewsList(currentPageInt + 1, ""); // 상태 업데이트 대기
                      const updatedNewsList = useNewstore.getState().newsList; // 최신 상태 가져오기
                      router.push(
                        `/board/${updatedNewsList[0]?.newsId}?currentPage=${currentPageInt + 1
                        }&userId=${userDetailInfo.userId}`
                      );
                    } else if (newsList[currentIndex + 1]?.newsId !== undefined) {
                      // 현재 페이지 내에서 이동
                      router.push(
                        `/board/${newsList[currentIndex + 1]?.newsId
                        }?currentPage=${currentPageInt}&userId=${userDetailInfo.userId}`
                      );
                    }
                  }}
                  className={
                    currentIndex === newsList.length - 1 &&
                      currentPageInt === PageInfo.totalPages
                      ? styles.disabled
                      : ""
                  }
                >
                  다음
                </Link>
              </div>


            </div>
            <div className={styles.read_right}>
              {userDetailInfo?.username === newsDetail.authorUsername && (
                <div className={styles.auth_btn_cont}>
                  <button
                    className={`${styles.read_btn} ${styles.update}`}
                    onClick={onClickEdit}
                  >
                    <FontAwesomeIcon icon={faPenAlt} />
                  </button>
                  <button
                    className={`${styles.read_btn} ${styles.delete}`}
                    onClick={onClickDelete}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewsDetail;
