"use client";
import { useSession } from "next-auth/react";
import styles from "./MyPage.module.css";
import MyPageQuestionListItems from "./MyPageQuestionListItems";
import { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/question";

const MyPageQuestionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const { getUserQuestionList, questionList } = useQuestionStore();
  useEffect(() => {
    getUserQuestionList("", currentPage - 1, "", session);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.q_header}>
        <span>
          남은 질문 횟수 : <b>10</b>
        </span>
      </div>
      <div className={styles.question_wrap}>
        <MyPageQuestionListItems
          questionContents={questionList}
          currentPage={currentPage}
          numShowContents={6}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default MyPageQuestionList;
