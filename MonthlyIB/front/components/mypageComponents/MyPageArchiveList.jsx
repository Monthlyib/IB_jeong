"use client";
import styles from "./MyPage.module.css";
import { useEffect, useState } from "react";
import MyPageArchiveListItems from "./MyPageArchiveListItems";
import { useUserInfo } from "@/store/user";
import { useBoardStore } from "@/store/board";

const MyPageArchiveList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { userInfo } = useUserInfo();
  const { getBoardUserList, boardList } = useBoardStore();

  useEffect(() => {
    getBoardUserList(currentPage, " ", userInfo);
  }, []);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.board_wrap}>
        <MyPageArchiveListItems
          bulletinBoardContents={boardList}
          currentPage={currentPage}
          numShowContents={5}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default MyPageArchiveList;
