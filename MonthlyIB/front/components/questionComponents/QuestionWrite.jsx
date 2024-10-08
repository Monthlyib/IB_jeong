"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Question.module.css";

import dynamic from "next/dynamic";
import { useQuestionStore } from "@/store/question";
import { useUserInfo, useUserStore } from "@/store/user";

const DynamicEditor = dynamic(
  () => import("@/components/boardComponents/EditorComponents"),
  {
    ssr: false,
  }
);

const QuestionWrite = ({ setModal, type, questionId, currentPage }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [questionStatus, setQuestionStatus] = useState("");
  const [title, setTitle] = useState("");
  const { questionDetail, postQuestionItem, reviseQuestionItem } =
    useQuestionStore();
  const closeRef = useRef();

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

  useEffect(() => {
    if (type === "revise") {
      setTitle(questionDetail?.title);
      setSubject(questionDetail?.subject);
      setContent(questionDetail?.content);
    }
  }, []);

  const onChangeSubject = (e) => {
    setSubject(e.target.value);
  };
  const onChangetitle = (e) => {
    setTitle(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (type === "write") {
      const res = await postQuestionItem(
        title,
        content,
        subject,
        userInfo,
        currentPage
      );
      setModal(false);
    } else if (type === "revise") {
      const res = await reviseQuestionItem(
        questionId,
        title,
        content,
        subject,
        questionStatus,
        userInfo
      );
      setModal(false);
    }
  };
  return (
    <>
      <form onSubmit={onSubmit} style={{ position: "relative", zIndex: 5000 }}>
        <div className={`${styles.md} ${styles.md_left}`}>
          <div
            className={styles.md_box_flex}
            ref={closeRef}
            onClick={(e) => closeRef.current === e.target && setModal(false)}
          >
            <div className={styles.md_box}>
              <div className={styles.md_top}>
                <div className={styles.tit}>질문 작성</div>

                <div className={styles.content}>
                  <input
                    type="text"
                    value={title}
                    onChange={onChangetitle}
                    className={styles.md_input}
                    placeholder="제목"
                  />
                  <input
                    type="text"
                    value={subject}
                    onChange={onChangeSubject}
                    className={styles.md_input}
                    placeholder="과목명"
                  />
                  <DynamicEditor
                    styleName={styles.editor}
                    content={content}
                    setContent={setContent}
                  />

                  <div className={styles.md_question_count}>
                    <span>
                      질문 남은 횟수 :{" "}
                      <b>{userSubscribeInfo?.[0]?.questionCount}</b>
                    </span>
                  </div>
                </div>
              </div>
              <button type="submit" className={styles.md_btn}>
                등록하기
              </button>
            </div>
          </div>
          <div className={styles.md_dim}></div>
        </div>
      </form>
    </>
  );
};

export default QuestionWrite;
