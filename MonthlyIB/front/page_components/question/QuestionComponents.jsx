import AppLayout from "../../main_components/AppLayout";
import styles from "../../styles/question.module.css";
import QuestionItems from "../../page_components/question/QuestionItems";
import { questionActions } from "../../reducers/question";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Form } from "antd";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";

const DynamicEditor = dynamic(
  () => import("../../page_components/board/EditorComponents"),
  {
    ssr: false,
  }
);

const QuestionComponents = () => {
  const { questionList, addQuestionDone, getQuestionListDone } = useSelector(
    (state) => state.question
  );
  const { User, logInDone } = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChangeSubject = useCallback((e) => {
    setSubject(e.target.value);
  });
  const onChangeContent = useCallback((e) => {
    setContent(e.target.value);
  });
  const onClickWrite = useCallback(() => {
    setModal(!modal);
  });
  const onChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  const onClickSearchButton = useCallback(() => {
    setSearchedPosts([
      ...questionList.filter((v) => v.content.includes(searchKeyword)),
    ]);
    setCurrentPage(1);
    setSeraching(true);
  }, [searchKeyword]);
  const onSubmit = useCallback(() => {
    dispatch(questionActions.addQuestionRequest({ title: subject }));
    router.push("/question");
  }, [subject]);

  useEffect(() => {
    if (getQuestionListDone === false) {
      dispatch(questionActions.getQuestionListRequest());
    }
  }, [getQuestionListDone]);

  useEffect(() => {
    if (addQuestionDone) {
      setSubject("");
      setContent("");
      setModal(false);
    }
  }, [addQuestionDone]);
  return (
    <>
      <AppLayout>
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
                <b>{questionList.length}</b>
              </div>
              {logInDone && (
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
              <Form
                onFinish={onSubmit}
                style={{ position: "relative", zIndex: 5000 }}
              >
                <div className={`${styles.md} ${styles.md_left}`}>
                  <div className={styles.md_box_flex}>
                    <div className={styles.md_box}>
                      <div className={styles.md_top}>
                        <div className={styles.tit}>질문 작성</div>

                        <div className={styles.content}>
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
                              질문 남은 횟수 : <b>8</b> / {User.qnas.length}
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
              </Form>
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
      </AppLayout>
    </>
  );
};

export default QuestionComponents;
