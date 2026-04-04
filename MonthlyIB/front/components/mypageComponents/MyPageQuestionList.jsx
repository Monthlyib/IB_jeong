"use client";
import styles from "./MyPage.module.css";
import MyPageQuestionListItems from "./MyPageQuestionListItems";
import { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/question";
import { useUserInfo, useUserStore } from "@/store/user";

const MyPageQuestionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { userInfo } = useUserInfo();
  const { getUserQuestionList, questionList, questionPageInfo } = useQuestionStore();
  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    if (localUser)
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
  }, []);
  useEffect(() => {
    if (!userInfo?.accessToken) {
      return;
    }

    getUserQuestionList("", currentPage, "", userInfo, 6);
  }, [currentPage, getUserQuestionList, userInfo]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.q_header}>
        <span>
          남은 질문 횟수 : <b>{userSubscribeInfo?.[0]?.questionCount}</b>
        </span>
      </div>
      <div className={styles.question_wrap}>
        <MyPageQuestionListItems
          questionContents={questionList}
          currentPage={currentPage}
          numShowContents={6}
          onPageChange={handlePageChange}
          totalPages={questionPageInfo?.totalPages ?? 1}
        />
      </div>
    </>
  );
};

export default MyPageQuestionList;
