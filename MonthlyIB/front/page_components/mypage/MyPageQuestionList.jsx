import { useSelector } from "react-redux";
import styles from "./MyPage.module.css";
import MyPageQuestionListItems from "./MyPageQuestionListItems";
import { useState } from "react";

const MyPageQuestionList = () => {
  const { User } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.q_header}>
        <span>
          남은 질문 횟수 : <b>{User?.plan?.qas ?? 0}</b>
        </span>
      </div>
      <div className={styles.question_wrap}>
        <MyPageQuestionListItems
          questionContents={User.qnas}
          currentPage={currentPage}
          numShowContents={6}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default MyPageQuestionList;
