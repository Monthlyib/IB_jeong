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

const NewsComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const searchKeyword = useRef();
  const [searching, setSearching] = useState(false);
  const { userInfo } = useUserInfo();
  const { newsList, getNewsList, PageInfo, loading } = useNewstore(); // PageInfo에 totalPages 포함

  const handlePageChange = (page) => {
    setCurrentPage(page); 
  };

  useEffect(() => {
    const search = searchKeyword.current ?? "";
    getNewsList(currentPage, search);
  }, [searching, currentPage]);


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
      </main>
    </>
  );
};

export default NewsComponents;
