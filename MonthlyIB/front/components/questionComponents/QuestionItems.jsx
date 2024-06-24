import styles from "./Question.module.css";
import _ from "lodash";
import Paginatation from "@/components/layoutComponents/Paginatation";
import Link from "next/link";

const QuestionItems = ({
  questions,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };

  const paginatedPage = paginate(questions, currentPage);
  return (
    <>
      {questions.length > 0 ? (
        paginatedPage.map((content) => (
          <div
            className={`${styles.question_item} 
                        ${
                          content.questionStatus !== "COMPLETE"
                            ? styles.reserve
                            : styles.wait
                        }`}
            key={content.questionId}
          >
            <Link href={`/question/${content.questionId}`}>
              <div className={styles.q_flex_top}>
                <p>{content?.title}</p>
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
        />
      )}
    </>
  );
};

export default QuestionItems;
