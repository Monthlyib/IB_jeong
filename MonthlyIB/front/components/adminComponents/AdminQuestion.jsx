import styles from "./AdminStyle.module.css";

import { useUserStore } from "@/store/user";
import { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/question";
import AdminQuestionItems from "./AdminQuestionItems";

const AdminQuestion = () => {
  const { userInfo } = useUserStore();
  const { questionList, getUserQuestionList } = useQuestionStore();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getUserQuestionList("", currentPage - 1, "", userInfo);
  }, []);

  useEffect(() => {
    console.log(questionList);
  }, [questionList]);

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>질문 관리</div>
        <div className={styles.question_subtitle}>
          <div>ID</div>
          <div>Name</div>
          <div>Date</div>
          <div style={{ position: "relative", left: "1rem" }}>Subject</div>
          <div style={{ position: "relative", left: "2rem" }}>Status</div>
          <div style={{ position: "relative", left: "5rem" }}>Tools</div>
        </div>

        {questionList.length > 0 && (
          <>
            <AdminQuestionItems
              questionList={questionList}
              currentPage={currentPage}
              numShowContents={30}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
};

export default AdminQuestion;