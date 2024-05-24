"use client";

import styles from "./Question.module.css";
import QuestionItems from "./QuestionItems";
import QuestionWrite from "./QuestionWrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { useQuestionStore } from "@/store/question";

const QuestionComponents = () => {
  const router = useRouter();
  const { questionList, getQuestionList } = useQuestionStore();
  const [modal, setModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);

  const { data: session } = useSession();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onClickWrite = useCallback(() => {
    setModal(!modal); // 배경 클릭 혹은 없애는 버튼 만들기
  });
  const onChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  //   const onClickSearchButton = useCallback(() => {
  //     setSearchedPosts([
  //       ...questionList.filter((v) => v.content.includes(searchKeyword)),
  //     ]);
  //     setCurrentPage(1);
  //     setSeraching(true);
  //   }, [searchKeyword]);

  useEffect(() => {
    getQuestionList(currentPage);
  }, []);
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
              value={searchKeyword}
              onChange={onChange}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") {
              //     onClickSearchButton();
              //   }
              // }}
            />
            <button>검색</button>
          </div>
        </div>

        <div className={styles.question_box_wrap}>
          <div className={styles.question_header}>
            <div className={styles.question_count}>
              <span>총 질문 수</span>
              <b>{questionList?.length}</b>
            </div>
            {session?.authority === "ADMIN" && (
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
          {modal === true && (
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
