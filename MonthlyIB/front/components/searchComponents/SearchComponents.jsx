"use client";
import styles from "./search.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import BulletinBoardItems from "@/components/boardComponents/commonboard/BulletinBoardItems";
import CourseItems from "@/components/courseComponents/CourseItems";
import IbItems from "@/components/ibComponents/IbItems";
import NewsItems from "@/components/boardComponents/news/NewsItems";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useBoardStore } from "@/store/board";
import { useIBStore } from "@/store/ib";
import { useCourseStore } from "@/store/course";
import { useNewstore } from "@/store/news";

const SearchComponents = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");

  const { boardList, getBoardList } = useBoardStore();
  const { ibPosts, getIBList } = useIBStore();
  const { coursePosts, getCourseList } = useCourseStore();
  const { newsList, getNewsList } = useNewstore();

  if (!keyword) {
    return null;
  }

  const [boardCurrentPage, setBoardCurrentPage] = useState(1);
  const [ibCurrentPage, setIbCurrentPage] = useState(1);
  const [courseCurrentPage, setCourseCurrentPage] = useState(1);
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    getBoardList(boardCurrentPage, keyword);
  }, [boardCurrentPage]);

  useEffect(() => {
    getIBList(ibCurrentPage, keyword);
  }, [ibCurrentPage]);

  useEffect(() => {
    getCourseList(courseCurrentPage, keyword, "", "", "", "");
  }, [courseCurrentPage]);

  useEffect(() => {
    getNewsList(newsCurrentPage, keyword);
  }, [courseCurrentPage]);

  const handleBoardPageChange = (page) => {
    setBoardCurrentPage(page);
  };

  const handleNewsPageChange = (page) => {
    setNewsCurrentPage(page);
  };

  const handleIbPageChange = (page) => {
    setIbCurrentPage(page);
  };

  const handleCoursePageChange = (page) => {
    setCourseCurrentPage(page);
  };

  const onChangeSearchKeyword = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  const onCheckEnter = useCallback((e) => {
    if (e.key === "Enter") {
      if (searchKeyword !== "") {
        router.push(`/search?keyword=${keyword}`);
      }
    }
  }, []);
  return (
    <>
      <main className="width_content search">
        <div className={styles.header_flex}>
          <div className={styles.header_tit_wrap}>
            <h2>검색결과</h2>
            <span>
              검색하신 <b id="title">{`[ ${keyword} ]`}</b> 결과는 총{" "}
              <b id="total">
                {boardList.length +
                  ibPosts.length +
                  coursePosts.length +
                  newsList.length}
              </b>
              개 입니다
            </span>
          </div>

          <div className="ft_search">
            <input
              type="text"
              placeholder="검색"
              value={searchKeyword}
              onChange={onChangeSearchKeyword}
              onKeyDown={onCheckEnter}
            />
            <Link href={`/search?keyword=${keyword}`}>
              <button
                onClick={() => {
                  router.push(`/search?keyword=${keyword}`);
                }}
              >
                검색
              </button>
            </Link>
          </div>
        </div>
        <div className="search_box_wrap">
          {coursePosts.length > 0 && (
            <div className={styles.category_wrap}>
              <h3>강의</h3>
              <div className="course_wrap">
                <div className="course_cont">
                  <CourseItems
                    courseContents={coursePosts}
                    currentPage={courseCurrentPage}
                    numShowContents={5}
                    onPageChange={handleCoursePageChange}
                  />
                </div>
              </div>
            </div>
          )}
          {ibPosts.length > 0 && (
            <div className={styles.category_wrap}>
              <h3>월간 IB</h3>
              <div className="course_wrap">
                <div className="course_cont">
                  <div className={styles.ib_archive_wrap}>
                    <div className={styles.ib_archive_cont}>
                      <IbItems
                        IBContents={ibPosts}
                        currentPage={ibCurrentPage}
                        numShowContents={6}
                        onPageChange={handleIbPageChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {newsList.length > 0 && (
            <div className={styles.category_wrap}>
              <h3>IB 입시뉴스</h3>
              <div className="board_wrap">
                <NewsItems
                  newsContents={newsList}
                  currentPage={newsCurrentPage}
                  numShowContents={5}
                  onPageChange={handleNewsPageChange}
                />
              </div>
            </div>
          )}
          {boardList.length && (
            <div className={styles.category_wrap}>
              <h3>자유게시판</h3>
              <div className="board_wrap">
                <BulletinBoardItems
                  bulletinBoardContents={boardList}
                  currentPage={boardCurrentPage}
                  numShowContents={5}
                  onPageChange={handleBoardPageChange}
                />
              </div>
            </div>
          )}
          {boardList.length +
            ibPosts.length +
            coursePosts.length +
            newsList.length ===
            0 && (
            <div className={styles.no_search}>
              <FontAwesomeIcon icon={faTimesCircle} />
              <span>검색하신 결과가 없습니다.</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default SearchComponents;
