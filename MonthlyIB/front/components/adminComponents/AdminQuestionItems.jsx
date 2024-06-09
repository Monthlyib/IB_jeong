import _ from "lodash";
import styles from "./AdminStyle.module.css";
import Paginatation from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { useQuestionStore } from "@/store/question";

const AdminQuestionItems = ({
  questionList,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const [modal, setModal] = useState(false);
  const [ind, setInd] = useState();
  const router = useRouter();

  const closeRef = useRef();

  const { userInfo } = useUserStore();
  const { deleteQuestionItem } = useQuestionStore();

  const onSubmitQuestion = () => {
    setModal(false);
  };

  const onSubmitDeleteTutoring = (questionId) => {
    setModal(false);
    deleteQuestionItem(questionId, userInfo);
  };

  const onClickEdit = (index) => {
    setModal(!modal);
    setInd(index);
  };
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(questionList, currentPage);
  console.log(paginatedPage);
  return (
    <>
      {paginatedPage.map((v, i) => (
        <>
          <hr />

          <div className={styles.questions}>
            {v.authorUsername}
            <div>{v.authorNickName}</div>
            <div>{v.createAt.split("T")[0]}</div>
            <div style={{ marginLeft: "1rem" }}>{v.subject}</div>
            <span style={{ lineHeight: "0.5" }}>
              {v.questionStatus === "ANSWER_WAIT" ? "답변대기" : "답변완료"}
            </span>
            <div style={{ marginLeft: "2em" }}>
              <FontAwesomeIcon icon={faPen} onClick={() => onClickEdit(i)} />
            </div>
          </div>
          <hr />
        </>
      ))}
      {questionList?.length > 0 && (
        <Paginatation
          contents={questionList}
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
                  {paginatedPage[ind]?.title}
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
                    __html: paginatedPage[ind]?.content,
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
                    onSubmitDeleteTutoring(paginatedPage[ind]?.questionId);
                  }}
                >
                  삭제
                </button>

                <button
                  type="button"
                  className={styles.revise}
                  onClick={() => {
                    router.push(`question/${paginatedPage[ind]?.questionId}`);
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
