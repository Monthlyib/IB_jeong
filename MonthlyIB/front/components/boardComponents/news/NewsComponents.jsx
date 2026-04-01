"use client";
import styles from "../BoardCommon.module.css";
import { useEffect, useState } from "react";
import NewsItems from "./NewsItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import BoardCommon from "../BoardCommon";
import { useNewstore } from "@/store/news";
import { useUserInfo } from "@/store/user";
import Loading from "../../Loading";
import { useRouter } from "next/navigation";

const NewsComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { userInfo } = useUserInfo();
  const { newsList, getNewsList, PageInfo, loading } = useNewstore();
  const router = useRouter();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
  };

  useEffect(() => {
    getNewsList(currentPage, searchQuery);
  }, [currentPage, searchQuery, getNewsList]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUserInfo = window.localStorage.getItem("userInfo");
    const hasPersistedSession = Boolean(storedUserInfo);
    const isLoggedIn = Boolean(userInfo?.authority) || hasPersistedSession;

    setIsPopupOpen(!isLoggedIn);
    setAuthResolved(true);
  }, [userInfo?.authority]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    router.push("/login");
  };

  return (
    <>
      <main className={`width_content archive ${styles.boardPage}`}>
        <section className={styles.boardHero}>
          <div className={styles.boardHeroCopy}>
            <span className={styles.boardEyebrow}>Monthly IB Newsroom</span>
            <h2>IB 입시뉴스</h2>
            <p>
              입시 일정, 대학 발표, 교육 트렌드를 한 화면에서 빠르게 확인할 수
              있도록 정리한 뉴스 보드입니다.
            </p>
          </div>

          <div className={styles.boardHeroAside}>
            <label className={styles.boardSearch}>
              <span className={styles.boardSearchLabel}>뉴스 검색</span>
              <div className={styles.boardSearchField}>
                <input
                  type="text"
                  placeholder="입시뉴스 검색"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <button type="button" onClick={handleSearch}>
                  검색
                </button>
              </div>
            </label>

            <div className={styles.boardHeroActions}>
              <div className={styles.boardStatCard}>
                <span>현재 게시글</span>
                <strong>{PageInfo?.totalElements ?? newsList.length ?? 0}</strong>
              </div>
              {userInfo?.authority === "ADMIN" && (
                <Link
                  href="/board/newswrite?type=write"
                  className={styles.boardWriteButton}
                >
                  <FontAwesomeIcon icon={faPenAlt} />
                  <span>글쓰기</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        <BoardCommon modal={0} />

        <section className={styles.boardPanel}>
          <div className={styles.boardPanelHeader}>
            <div>
              <span className={styles.boardPanelEyebrow}>Latest Updates</span>
              <h3>최신 입시 소식</h3>
            </div>
            <p>
              제목을 열면 상세 기사와 첨부 자료를 함께 확인할 수 있습니다.
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <NewsItems
              newsContents={newsList}
              currentPage={currentPage}
              totalPages={PageInfo.totalPages} // totalPages 전달
              onPageChange={handlePageChange}
            />
          )}
        </section>

        {authResolved && isPopupOpen && (
          <div className={styles.boardModalOverlay}>
            <div className={styles.boardModalCard}>
              <span className={styles.boardModalEyebrow}>Members Only</span>
              <h3>로그인 필요</h3>
              <p>로그인하시면 더 많은 정보를 확인하실 수 있습니다.</p>
              <button type="button" onClick={handleClosePopup}>
                로그인하기
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default NewsComponents;
