"use client";
import styles from "../BoardCommon.module.css";
import { useEffect, useState } from "react";
import BulletinBoardItems from "./BulletinBoardItems";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import BoardCommonHead from "../BoardCommonHead";
import { useBoardStore } from "@/store/board";
import { useUserInfo } from "@/store/user";

const BulletinBoardComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { userInfo } = useUserInfo();
  const { boardList, getBoardList, PageInfo } = useBoardStore();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
  };

  useEffect(() => {
    getBoardList(currentPage, searchQuery);
  }, [currentPage, searchQuery, getBoardList]);

  return (
    <>
      <main className={`width_content archive ${styles.boardPage}`}>
        <BoardCommonHead
          modal={3}
          eyebrow="Monthly IB Community"
          title="자유게시판"
          description="질문, 후기, 학습 팁을 한곳에서 공유하고 필요한 글을 검색해 바로 이어서 확인할 수 있습니다."
          search={{
            label: "게시글 검색",
            placeholder: "자유게시판 검색",
            value: searchInput,
            onChange: setSearchInput,
            onSubmit: handleSearch,
          }}
          stats={[
            {
              label: "현재 게시글",
              value: PageInfo?.totalElements ?? boardList.length ?? 0,
            },
          ]}
          action={
            userInfo?.userStatus === "ACTIVE" ? (
              <Link
                href="/board/free/write?type=write"
                className={styles.boardWriteButton}
              >
                <FontAwesomeIcon icon={faPenAlt} />
                <span>글쓰기</span>
              </Link>
            ) : null
          }
        />
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
