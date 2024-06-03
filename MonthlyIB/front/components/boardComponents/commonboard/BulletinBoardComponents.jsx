"use client";
import styles from "../BoardCommon.module.css";
import { useCallback, useEffect, useState } from "react";
import BulletinBoardItems from "./BulletinBoardItems";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import BoardCommonHead from "../BoardCommonHead";
import { useBoardStore } from "@/store/board";
import { useUserStore } from "@/store/user";

const BulletinBoardComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);

  const { userInfo } = useUserStore();
  const { boardList, getBoardList } = useBoardStore();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChangeSearch = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  useEffect(() => {
    getBoardList(currentPage);
  }, []);

  // const onClickSearchButton = useCallback(() => {
  //   setCurrentPage(1);
  //   setSeraching(true);
  // }, [searchKeyword]);

  return (
    <>
      <main className="width_content archive">
        <BoardCommonHead
          searchKeyword={searchKeyword}
          onChangeSearch={onChangeSearch}
          modal={3}
          placeholder="자유게시판 검색"
        />
        {userInfo?.userStatus === "ACTIVE" && (
          <div className={styles.right_btn}>
            <Link
              href="/board/free/write?type=write"
              className={styles.btn_write}
            >
              <FontAwesomeIcon icon={faPenAlt} />
              <span>글쓰기</span>
            </Link>
          </div>
        )}
        <div className={styles.board_wrap}>
          <BulletinBoardItems
            bulletinBoardContents={searching ? searchedPosts : boardList}
            currentPage={currentPage}
            numShowContents={5}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
};

export default BulletinBoardComponents;
