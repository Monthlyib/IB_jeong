"use client";
import styles from "../BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faPenAlt,
  faTrashAlt,
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useNewstore } from "@/store/news";
import { newsDeleteItem } from "@/apis/newsAPI";
import { useUserInfo } from "@/store/user";
import { getCookie } from "@/apis/cookies";
import Loading from "../../Loading";
import BoardCommon from "../BoardCommon";

const NewsDetail = (pageId) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("currentPage");
  const session = getCookie("accessToken");
  const { userInfo } = useUserInfo();
  const { newsDetail, getNewsDetail, newsList, getNewsList, PageInfo, loading } =
    useNewstore();
  const currentPageInt = Number(currentPage) || 1;
  const currentIndex = newsList.findIndex(
    (v) => v.newsId === Number(pageId?.pageId)
  );
  const hasListContext = currentIndex >= 0;
  const isAuthor = userInfo?.username === newsDetail?.authorUsername;
  const attachments = useMemo(() => newsDetail?.files ?? [], [newsDetail?.files]);

  const onClickDelete = useCallback(() => {
    newsDeleteItem(Number(pageId?.pageId), { accessToken: session });
    getNewsList(currentPageInt, "");
    router.push("/board");
  }, [currentPageInt, getNewsList, pageId?.pageId, router, session]);

  useEffect(() => {
    getNewsDetail(Number(pageId?.pageId), { accessToken: session });
    getNewsList(currentPageInt, "");
  }, [currentPageInt, getNewsDetail, getNewsList, pageId?.pageId, session]);

  const onClickEdit = useCallback(() => {
    router.push(`/board/newswrite?type=revise&newsId=${pageId.pageId}`);
  }, [pageId.pageId, router]);

  const moveToPrev = useCallback(async () => {
    if (!hasListContext) return;

    if (currentIndex === 0 && currentPageInt > 1) {
      await getNewsList(currentPageInt - 1, "");
      const updatedNewsList = useNewstore.getState().newsList;
      const targetId = updatedNewsList[updatedNewsList.length - 1]?.newsId;
      if (targetId) {
        router.push(`/board/${targetId}?currentPage=${currentPageInt - 1}`);
      }
      return;
    }

    const targetId = newsList[currentIndex - 1]?.newsId;
    if (targetId) {
      router.push(`/board/${targetId}?currentPage=${currentPageInt}`);
    }
  }, [currentIndex, currentPageInt, getNewsList, hasListContext, newsList, router]);

  const moveToNext = useCallback(async () => {
    if (!hasListContext) return;

    if (currentIndex === newsList.length - 1 && currentPageInt < PageInfo.totalPages) {
      await getNewsList(currentPageInt + 1, "");
      const updatedNewsList = useNewstore.getState().newsList;
      const targetId = updatedNewsList[0]?.newsId;
      if (targetId) {
        router.push(`/board/${targetId}?currentPage=${currentPageInt + 1}`);
      }
      return;
    }

    const targetId = newsList[currentIndex + 1]?.newsId;
    if (targetId) {
      router.push(`/board/${targetId}?currentPage=${currentPageInt}`);
    }
  }, [
    PageInfo.totalPages,
    currentIndex,
    currentPageInt,
    getNewsList,
    hasListContext,
    newsList,
    router,
  ]);

  const prevDisabled = !hasListContext || (currentIndex === 0 && currentPageInt === 1);
  const nextDisabled =
    !hasListContext ||
    (currentIndex === newsList.length - 1 && currentPageInt === PageInfo.totalPages);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className={`width_content ${styles.newsDetailPage}`}>
      <div className={styles.newsDetailMain}>
        <section className={styles.boardHero}>
          <div className={styles.boardHeroCopy}>
            <span className={styles.boardEyebrow}>Monthly IB Newsroom</span>
            <h2>IB 입시뉴스</h2>
            <p>
              IB 입시뉴스의 상세 기사와 첨부 자료를 문서형 화면으로 확인할 수
              있습니다.
            </p>
          </div>

          <div className={styles.boardHeroAside}>
            <div className={styles.boardStatCard}>
              <span>현재 게시글</span>
              <strong>{PageInfo?.totalElements ?? newsList.length ?? 0}</strong>
            </div>
            <div className={styles.newsDetailTopActions}>
              <Link href="/board" className={styles.boardBackLink}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>목록으로</span>
              </Link>
              {isAuthor && (
                <>
                  <button
                    type="button"
                    className={styles.newsDetailTopButton}
                    onClick={onClickEdit}
                  >
                    <FontAwesomeIcon icon={faPenAlt} />
                    <span>수정</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.newsDetailTopButton} ${styles.newsDetailDeleteButton}`}
                    onClick={onClickDelete}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                    <span>삭제</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <BoardCommon modal={0} />

        <article className={styles.newsDetailArticle}>
          {attachments.length > 0 && (
            <section className={styles.newsDetailAttachments}>
              <div className={styles.newsDetailSectionTop}>
                <div>
                  <span className={styles.newsDetailMiniLabel}>Attachments</span>
                  <h3>첨부 자료</h3>
                </div>
                <p>다운로드 가능한 파일을 한 번에 확인할 수 있습니다.</p>
              </div>
              <ul>
                {attachments.map((file) => (
                  <li key={`${file.fileUrl}-${file.fileName}`}>
                    <a href={file.fileUrl} download>
                      <FontAwesomeIcon icon={faFile} />
                      <span>{file.fileName}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className={styles.newsDetailContent}>
            <div className={styles.newsDetailContentHeader}>
              <span className={styles.newsDetailMiniLabel}>기사 제목</span>
              <h1>{newsDetail.title}</h1>
              <div className={styles.newsDetailMeta}>
                <span>{newsDetail.authorUsername}</span>
                <b>·</b>
                <span>{newsDetail.createAt}</span>
                <b>·</b>
                <span>조회수 {newsDetail.viewCount}</span>
              </div>
            </div>
            <div className={styles.newsDetailContentDivider} />
            <div className={styles.newsDetailSectionTop}>
              <div>
                <span className={styles.newsDetailMiniLabel}>기사 본문</span>
                <h3>기사 본문</h3>
              </div>
            </div>
            <div
              className={styles.newsDetailBody}
              dangerouslySetInnerHTML={{
                __html: newsDetail.content,
              }}
            />
          </section>

          <div className={styles.newsNavArea}>
            <button
              type="button"
              onClick={moveToPrev}
              className={styles.newsNavButton}
              disabled={prevDisabled}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>이전 글</span>
            </button>
            <button
              type="button"
              onClick={moveToNext}
              className={styles.newsNavButton}
              disabled={nextDisabled}
            >
              <span>다음 글</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </article>
      </div>
    </main>
  );
};

export default NewsDetail;
