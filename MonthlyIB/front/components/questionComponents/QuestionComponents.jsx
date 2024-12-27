"use client";

import styles from "./Question.module.css";
import QuestionItems from "./QuestionItems";
import QuestionWrite from "./QuestionWrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";

import { getCookie } from "@/apis/cookies";
import { useQuestionStore } from "@/store/question";
import { useUserInfo, useUserStore } from "@/store/user";

const QuestionComponents = () => {
  const { questionList,getQuestionList, getUserQuestionList } = useQuestionStore();
  const [modal, setModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const searchKeyword = useRef();
  const [searching, setSeraching] = useState(false);

  const { userInfo } = useUserInfo();
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onClickWrite = useCallback(() => {
    setModal(!modal); // 배경 클릭 혹은 없애는 버튼 만들기
  });
  const onChange = (e) => {
    searchKeyword.current = e.target.value;
  };
  const onClickSearchButton = () => {
    setSeraching((prev) => !prev);
  };

  const tempAccess = {};

  useEffect(() => {
    const search =
      searchKeyword.current === undefined ? "" : searchKeyword.current;
    tempAccess.accessToken = getCookie("accessToken");

    if (tempAccess?.accessToken) {
      if (userInfo?.authority === "ADMIN") {
        // ADMIN일 경우 모든 질문을 조회
        getQuestionList(currentPage, search);
      } else {
        // 일반 사용자일 경우 자신의 질문만 조회
        getUserQuestionList("", currentPage - 1, search, tempAccess);
      }
    }
  }, [searching, currentPage, modal]);


  return (
    <>
      <main className="width_content question">
        <div className="header_flex">
          <div className="header_tit_wrap">
            <span>Question</span>
            <h2>질문하기</h2>
          </div>

          <div className="ft_search">
            <input
              type="text"
              placeholder="질문 검색"
              defaultValue={searchKeyword.current}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onClickSearchButton();
                }
              }}
            />
            <button onClick={onClickSearchButton}>검색</button>
          </div>
        </div>

        <div className={styles.question_box_wrap}>
          <div className={styles.question_header}>
            <div className={styles.question_count}>
              <span>총 질문 수</span>
              <b>{questionList?.length}</b>
            </div>
            {(userInfo?.authority === "USER" ||
              userSubscribeInfo?.[0]?.subscribeStatus === "ACTIVE") && (
              <button
                type="button"
                className="btn_write"
                onClick={onClickWrite}
              >
                <FontAwesomeIcon icon={faPenAlt} />
                <span>질문하기</span>
              </button>
            )}
          </div>
          {modal === true &&
            (userInfo?.authority === "USER" ||
              userSubscribeInfo?.[0]?.subscribeStatus === "ACTIVE") && (
              <QuestionWrite
                setModal={setModal}
                currentPage={currentPage}
                type="write"
              />
            )}
          <div className={styles.question_wrap}>
            <div className={styles.question_cont}>
              <QuestionItems
                questions={searching ? searchedPosts : questionList}
                currentPage={currentPage}
                numShowContents={6}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default QuestionComponents;
