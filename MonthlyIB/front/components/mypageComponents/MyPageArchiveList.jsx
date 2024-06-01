"use client";
import styles from "./MyPage.module.css";
import { useState } from "react";
import MyPageArchiveListItems from "./MyPageArchiveListItems";

const MyPageArchiveList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.board_wrap}>
        {/* <MyPageArchiveListItems
          bulletinBoardContents={User.posts}
          currentPage={currentPage}
          numShowContents={5}
          onPageChange={handlePageChange}
        /> */}
      </div>
    </>
  );
};

export default MyPageArchiveList;
