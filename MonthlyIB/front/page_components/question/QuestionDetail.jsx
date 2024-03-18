import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/question.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { questionActions } from "../../reducers/question";

const QuestionDetail = ({ pageId }) => {
  const dispatch = useDispatch();
  const { questionDetail } = useSelector((state) => state.question);
  const { User, logInDone } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(questionActions.getQuestionDetailRequest({ num: pageId }));
  }, []);
  console.log(questionDetail.answer === null ? styles.reserve : styles.wait);
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
                      questionDetail.answer === null
                        ? styles.wait
                        : styles.reserve
                    }`}
                  >
                    {questionDetail.answer === true ? "답변완료" : "답변대기"}
                  </span>

                  <div className={styles.dt_question_info}>
                    <span className={styles.class}>
                      {questionDetail?.class}
                    </span>
                    <span className={styles.date}>{questionDetail.date}</span>
                  </div>
                </div>
                <div className={styles.dt_question_content}>
                  <span>Q.</span>
                  <h2>{questionDetail?.title}</h2>
                </div>
              </div>
              {questionDetail.answer == true ? (
                <div className={styles.dt_answer}>
                  <div className={styles.dt_answer_top}>
                    <span className={`${styles.q_ceiling} ${styles.answer}`}>
                      답변내용
                    </span>

                    <div className={styles.dt_answer_info}>
                      <span className={styles.date}>{questionDetail.date}</span>
                    </div>
                  </div>
                  <div className={styles.dt_answer_content}>
                    <span>A.</span>
                    <div>
                      <p>
                        {questionDetail.Answer.content}
                        <img
                          src={questionDetail.Answer.Image.src}
                          alt="잡지 이미지"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.dt_answer}>
                  <h1>아직 답변이 없습니다.</h1>
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
          {logInDone && (
            <div className={styles.dt_question_right}>
              <div className={styles.dt_question_profile}>
                <div className={styles.dt_question_user}>
                  <span className={styles.user_nm}>
                    <b>{User.name}</b> 님
                  </span>
                  <span className={styles.count}>
                    작성한 질문 수 <b>{User.qnas.length}</b>
                  </span>
                </div>
                <figure>
                  <img
                    src={User.Image.src}
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
