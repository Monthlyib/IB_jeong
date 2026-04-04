import styles from "./Question.module.css";
import Paginatation from "@/components/layoutComponents/Paginatation";
import Link from "next/link";

const QuestionItems = ({
  questions,
  currentPage,
  numShowContents,
  onPageChange,
  totalPages,
  isAdmin = false,
}) => {
  return (
    <>
      {questions.length > 0 ? (
        questions.map((content) => (
          <div
            className={`${styles.question_item} 
                        ${
                          content.questionStatus !== "COMPLETE"
                            ? styles.reserve
                            : styles.wait
                        }`}
            key={content.questionId}
          >
            <Link
              href={`/question/${content.questionId}?currentPage=${currentPage}`}
            >
              <div className={styles.q_flex_top}>
                <p>{content?.title}</p>
                {isAdmin && (
                  <span className={styles.q_author}>
                    작성자: {content?.authorNickName} ({content?.authorUsername})
                  </span>
                )}
              </div>
              <div className={styles.q_flex_bottom}>
                <span className={styles.q_class}>{content?.subject}</span>
                <span
                  className={`${styles.q_ceiling} ${
                    content?.questionStatus === "ANSWER_WAIT"
                      ? styles.wait
                      : styles.reserve
                  }`}
                >
                  {content.questionStatus === "COMPLETE"
                    ? "답변완료"
                    : "답변대기"}
                </span>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className={styles.course_no}>
          <p>질문이 없습니다.</p>
        </div>
      )}
      {questions.length > 0 && (
        <Paginatation
          contents={questions}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      )}
    </>
  );
};

export default QuestionItems;
