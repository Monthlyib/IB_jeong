"use client";
import styles from "../BoardCommon.module.css";
import { use, useCallback, useEffect, useRef, useState } from "react";
import BulletinBoardItems from "./BulletinBoardItems";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import BoardCommonHead from "../BoardCommonHead";
import { useBoardStore } from "@/store/board";
import { useUserInfo } from "@/store/user";

const BulletinBoardComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const searchKeyword = useRef();
  const [searching, setSeraching] = useState(false);

  const { userInfo } = useUserInfo();
  const { boardList, getBoardList, PageInfo } = useBoardStore();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const search =
      searchKeyword.current === undefined ? "" : searchKeyword.current;
    getBoardList(currentPage, search);
  }, [searching,currentPage]);

  return (
    <>
      <main className="width_content archive">
        <BoardCommonHead
          searchKeyword={searchKeyword}
          setSeraching={setSeraching}
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
            bulletinBoardContents={boardList}
            currentPage={currentPage}
            numShowContents={5}
            totalPage={PageInfo.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
};

export default BulletinBoardComponents;
