"use client";
// import { useSelector } from "react-redux";
import styles from "../BoardCommon.module.css";
import { useCallback, useState } from "react";
import NewsItems from "./NewsItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import BoardCommonHead from "../BoardCommonHead";

const NewsComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);
  const [news, setNews] = useState([]);
  // const { news } = useSelector((state) => state.news);
  // const { logInDone } = useSelector((state) => state.user);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onChangeSearch = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  const onClickSearchButton = useCallback(() => {
    setSearchedPosts([...news.filter((v) => v.title.includes(searchKeyword))]);
    setCurrentPage(1);
    setSeraching(true);
  }, [searchKeyword]);

  return (
    <>
      <main className="width_content archive">
        <BoardCommonHead
          searchKeyword={searchKeyword}
          onChangeSearch={onChangeSearch}
          modal={0}
          placeholder="입시뉴스 검색"
        />
        {/* {logInDone && (
          <div className={styles.right_btn}>
            <Link href="/board/newswrite" className={styles.btn_write}>
              <FontAwesomeIcon icon={faPenAlt} />
              <span>글쓰기</span>
            </Link>
          </div>
        )} */}
        <div className={styles.board_wrap}>
          <NewsItems
            newsContents={searching ? searchedPosts : news}
            currentPage={currentPage}
            numShowContents={5}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
};

export default NewsComponents;
