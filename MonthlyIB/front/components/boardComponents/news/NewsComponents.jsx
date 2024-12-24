"use client";
import styles from "../BoardCommon.module.css";
import { useEffect, useRef, useState } from "react";
import NewsItems from "./NewsItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import BoardCommonHead from "../BoardCommonHead";
import { useNewstore } from "@/store/news";
import { useUserInfo } from "@/store/user";
import Loading from "../../Loading";
import { useRouter } from "next/navigation";

const NewsComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const searchKeyword = useRef();
  const [searching, setSearching] = useState(false);
  const { userInfo } = useUserInfo();
  const { newsList, getNewsList, PageInfo, loading } = useNewstore(); // PageInfo에 totalPages 포함
  const router = useRouter();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const search = searchKeyword.current ?? "";
    getNewsList(currentPage, search);

    // Show popup if user is not logged in
    console.log(userInfo);
    if (userInfo?.authority === undefined) {
      setIsPopupOpen(true);
    }
  }, [searching, currentPage]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    router.push("/login");
  };

  return (
    <>
      <main className="width_content archive">
        <BoardCommonHead
          searchKeyword={searchKeyword}
          setSeraching={setSearching}
          modal={0}
          placeholder="입시뉴스 검색"
        />
        {userInfo?.authority === "ADMIN" && (
          <div className={styles.right_btn}>
            <Link
              href="/board/newswrite?type=write"
              className={styles.btn_write}
            >
              <FontAwesomeIcon icon={faPenAlt} />
              <span>글쓰기</span>
            </Link>
          </div>
        )}
        <div className={styles.board_wrap}>
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
        </div>

        {/* Popup Modal */}
        {/* Popup Modal */}
        {isPopupOpen && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "30px",
                textAlign: "center",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                width: "400px", // 팝업의 크기를 키움
              }}
            >
              <h2
                style={{
                  marginBottom: "20px",
                  fontSize: "20px",
                  color: "#5a2d82", // 헤더 색상 변경
                }}
              >
                로그인 필요
              </h2>
              <p
                style={{
                  marginBottom: "30px",
                  fontSize: "16px",
                }}
              >
                로그인하시면 더 많은 정보를 확인하실 수 있습니다.
              </p>
              <button
                onClick={handleClosePopup}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#5a2d82", // 버튼 색상 헤더 색과 일치
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default NewsComponents;