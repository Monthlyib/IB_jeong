"use client";
import styles from "./Question.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Image from "next/image";
import { questionDelete } from "@/apis/questionAPI";
import { useRouter } from "next/navigation";
import QuestionWrite from "./QuestionWrite";
import { useQuestionStore } from "@/store/question";
import { useUserStore } from "@/store/user";
const DynamicEditor = dynamic(
  () => import("@/components/boardComponents/EditorComponents"),
  {
    ssr: false,
  }
);

const QuestionDetail = (pageId) => {
  const { userInfo } = useUserStore();
  const {
    questionDetail,
    getQuestionDetail,
    deleteQuestionAnswer,
    reviseQuestionAnswer,
    submitQuestionAnswer,
  } = useQuestionStore();
  const [answerContent, setAnswerContent] = useState("");
  const [modal, setModal] = useState(false);
  const [answerReviseModal, setAnswerReviseModal] = useState(false);
  const [reviseModal, setReviseModal] = useState(false);
  const router = useRouter();

  const onClickWriteAnswer = () => {
    setModal(!modal);
  };

  const onClickRevise = () => {
    setReviseModal(!reviseModal);
  };
  const onClickAnswerRevise = () => {
    setAnswerReviseModal(!answerReviseModal);
  };

  const onClickAnswerDelete = () => {
    deleteQuestionAnswer(
      questionDetail?.answer.answerId,
      pageId?.pageId,
      userInfo
    );
  };

  const onClickDelete = () => {
    questionDelete(pageId?.pageId, userInfo);
    router.push("/question");
  };

  const onClickSumitReviseAnswer = async (e) => {
    e.preventDefault();
    reviseQuestionAnswer(
      questionDetail.answer.answerId,
      pageId?.pageId,
      answerContent,
      userInfo
    );
    setAnswerReviseModal(!answerReviseModal);
  };

  const onClickSumitAnswer = async (e) => {
    e.preventDefault();
    submitQuestionAnswer(pageId?.pageId, answerContent, userInfo);
    setAnswerContent("");
    setModal(!modal);
  };

  useEffect(() => {
    if (answerReviseModal) setAnswerContent(questionDetail?.answer.content);
  }, [answerReviseModal]);

  useEffect(() => {
    getQuestionDetail(pageId?.pageId);
    console.log(questionDetail);
  }, []);

  return (
    <>
      <main className="width_content question">
        <div className={styles.dt_question_flex}>
          <div className={styles.dt_question_left}>
            <div className={styles.dt_question_wrap}>
              <div className={styles.dt_question}>
                <div className={styles.dt_question_top}>
                  <span
                    className={`${styles.q_ceiling} ${
                      questionDetail?.answer?.answerId !== undefined
                        ? styles.wait
                        : styles.reserve
                    }`}
                  >
                    {questionDetail?.answer?.answerId !== undefined
                      ? "답변완료"
                      : "답변대기"}
                  </span>

                  <div className={styles.dt_question_info}>
                    <span className={styles.class}>
                      {questionDetail?.subject}
                    </span>
                    <span className={styles.date}>
                      {questionDetail?.createAt}
                    </span>
                  </div>
                </div>
                <div className={styles.dt_question_title}>
                  <span>Q.</span>
                  <h2>{questionDetail?.title}</h2>
                  {(questionDetail?.authorId === userInfo?.userId ||
                    userInfo?.authority === "ADMIN") && (
                    <div className={styles.dt_question_title_menu}>
                      <button onClick={onClickRevise}>수정</button>
                      <button onClick={onClickDelete}>삭제</button>
                    </div>
                  )}
                  {reviseModal === true && (
                    <QuestionWrite
                      setModal={setReviseModal}
                      type="revise"
                      questionId={pageId.pageId}
                    />
                  )}
                </div>
                <span
                  className={styles.dt_question_content}
                  dangerouslySetInnerHTML={{
                    __html: questionDetail?.content,
                  }}
                ></span>
              </div>
              {questionDetail?.answer?.answerId !== undefined ? (
                <div className={styles.dt_answer_exist}>
                  <div className={styles.dt_answer_top}>
                    <span className={`${styles.q_ceiling} ${styles.answer}`}>
                      답변내용
                    </span>

                    <div className={styles.dt_answer_info}>
                      <span className={styles.date}>
                        {questionDetail.answer?.createAt}
                      </span>
                      {userInfo?.authority === "ADMIN" && (
                        <div className={styles.dt_question_title_menu}>
                          <button onClick={onClickAnswerRevise}>수정</button>
                          <button onClick={onClickAnswerDelete}>삭제</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.dt_answer_content}>
                    <span>A.</span>
                    <div>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: questionDetail?.answer?.content,
                        }}
                      ></p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.dt_answer}>
                  <h1>아직 답변이 없습니다.</h1>
                  {userInfo?.authority === "ADMIN" && (
                    <button
                      type="button"
                      className="btn_write"
                      onClick={onClickWriteAnswer}
                    >
                      <FontAwesomeIcon icon={faPenAlt} />
                      <span>답글작성</span>
                    </button>
                  )}
                </div>
              )}
              {(modal === true || answerReviseModal) && (
                <DynamicEditor
                  styleName={styles.answer_editor}
                  content={answerContent}
                  setContent={setAnswerContent}
                />
              )}
            </div>
            <div>
              {(modal === true || answerReviseModal) && (
                <div
                  className="inputbox_cont"
                  style={{ height: 50, textAlign: "center" }}
                >
                  <button
                    style={{
                      position: "relative",
                      margin: "0 auto",
                      minWidth: "18.5rem",
                    }}
                    onClick={
                      modal === true
                        ? onClickSumitAnswer
                        : onClickSumitReviseAnswer
                    }
                  >
                    제출
                  </button>
                </div>
              )}
            </div>
            <div className="archive_bottom_btn">
              <div className="left_area btn_area">
                <Link href="/question" className="list">
                  목록
                </Link>
              </div>

              <div className="right_area btn_area">
                <Link href="#" className="prev">
                  이전
                </Link>
                <Link href="#" className="next">
                  다음
                </Link>
              </div>
            </div>
            <Link href="/tutoring" className={styles.shot_bn}>
              <div className={styles.shot_bn_img}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className={styles.shot_bn_txt}>
                <h6>수업 스케줄링</h6>
                <span>바로가기</span>
              </div>
            </Link>
          </div>
          {userInfo?.userStatus === "ACTIVE" && (
            <div className={styles.dt_question_right}>
              <div className={styles.dt_question_profile}>
                <div className={styles.dt_question_user}>
                  <span className={styles.user_nm}>
                    <b>{userInfo?.nickname}</b> 님
                  </span>
                  <span className={styles.count}>
                    작성한 질문 수{/* <b>{User.qnas.length}</b> */}
                  </span>
                </div>
                <figure>
                  <Image
                    src={
                      userInfo?.userImage === undefined
                        ? "/img/common/user_profile.jpg"
                        : userInfo?.userImage
                    }
                    width="100"
                    height="100"
                    alt="user profile img"
                  />
                </figure>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default QuestionDetail;
