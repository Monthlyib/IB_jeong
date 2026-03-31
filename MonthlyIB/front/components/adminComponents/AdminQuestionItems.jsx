import styles from "./AdminStyle.module.css";
import Paginatation from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { useUserInfo } from "@/store/user";
import { useRouter } from "next/navigation";
import { useQuestionStore } from "@/store/question";

const AdminQuestionItems = ({
  questionList,
  allQuestionList,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const [modal, setModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const router = useRouter();
  const closeRef = useRef();

  const { userInfo } = useUserInfo();
  const { deleteQuestionItem } = useQuestionStore();

  const onSubmitQuestion = () => {
    setModal(false);
  };

  const onSubmitDeleteQuestion = (questionId) => {
    setModal(false);
    deleteQuestionItem(questionId, userInfo);
  };

  const onClickEdit = (question) => {
    setSelectedQuestion(question);
    setModal(true);
  };

  return (
    <>
      <div className={styles.tableBody}>
        {questionList.map((question) => (
          <div key={question.questionId} className={styles.tableRowWrap}>
            <div className={`${styles.questions} ${styles.questionGrid}`}>
              <div className={styles.tableCell}>{question.authorUsername}</div>
              <div className={styles.tableCell}>{question.authorNickName}</div>
              <div className={styles.tableCell}>
                {question.createAt?.split("T")[0]}
              </div>
              <div className={styles.tableCell}>{question.subject}</div>
              <div className={styles.tableCell}>
                {question.questionStatus === "ANSWER_WAIT" ? "답변대기" : "답변완료"}
              </div>
              <div className={styles.tableTools}>
                <FontAwesomeIcon
                  icon={faPen}
                  onClick={() => onClickEdit(question)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {allQuestionList?.length > 0 && (
        <Paginatation
          contents={allQuestionList}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}

      {modal === true && (
        <div className={styles.md}>
          <div
            className={styles.md_box_flex}
            ref={closeRef}
            onClick={(e) => closeRef.current === e.target && setModal(false)}
          >
            <div
              className={styles.admin_box}
              style={{ width: "60rem", position: "relative" }}
            >
              <div className={styles.md_top}>
                <div className={styles.tit} style={{ marginBottom: "5srem" }}>
                  {selectedQuestion?.title}
                </div>
                <div
                  style={{
                    position: "relative",
                    textAlign: "left",
                    fontSize: "2rem",
                    marginBottom: "2rem",
                  }}
                >
                  질문내용
                </div>
                <p
                  style={{
                    display: "block",
                    width: "100%",
                    height: "20rem",
                    fontSize: "1.8rem",
                    marginBottom: "3rem",
                    border: "2px black solid",
                  }}
                  type="text"
                  dangerouslySetInnerHTML={{
                    __html: selectedQuestion?.content,
                  }}
                  disabled
                />
              </div>
              <div className={styles.btn_wrap}>
                <button
                  type="button"
                  className={styles.ok}
                  onClick={onSubmitQuestion}
                >
                  확인
                </button>
                <button
                  type="button"
                  className={styles.delete}
                  onClick={() => {
                    onSubmitDeleteQuestion(selectedQuestion?.questionId);
                  }}
                >
                  삭제
                </button>

                <button
                  type="button"
                  className={styles.revise}
                  onClick={() => {
                    router.push(`/question/${selectedQuestion?.questionId}`);
                  }}
                >
                  자세히
                </button>
              </div>
            </div>
          </div>
          <div className={styles.md_dim}></div>
        </div>
      )}
    </>
  );
};

export default AdminQuestionItems;
