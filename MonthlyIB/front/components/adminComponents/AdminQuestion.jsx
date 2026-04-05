import styles from "./AdminStyle.module.css";

import { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/question";
import AdminQuestionItems from "./AdminQuestionItems";
import { getCookie } from "@/apis/cookies";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminQuestion = () => {
  const { questionList, questionPageInfo, getUserQuestionList } = useQuestionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      return;
    }

    getUserQuestionList("", currentPage, "", { accessToken }, pageSize);
  }, [currentPage, pageSize, getUserQuestionList]);

  useEffect(() => {
    const totalPages = questionPageInfo?.totalPages ?? 1;
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, questionPageInfo?.totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.dashboard_mid_card}>
      <div className={styles.title}>질문 관리</div>

      <div className={styles.tableToolbar}>
        <div className={styles.tableMeta}>
          <strong>{questionPageInfo?.totalElements ?? questionList?.length ?? 0}</strong>
          <span>개의 질문</span>
        </div>

        <label className={styles.rowsPerPage}>
          <span>항목 보기</span>
          <select value={pageSize} onChange={handlePageSizeChange}>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}개씩 보기
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={`${styles.question_subtitle} ${styles.questionGrid}`}>
        <div className={styles.tableHeaderStatic}>
          <span className={styles.tableHeaderLabel}>ID</span>
        </div>
        <div className={styles.tableHeaderStatic}>
          <span className={styles.tableHeaderLabel}>Name</span>
        </div>
        <div className={styles.tableHeaderStatic}>
          <span className={styles.tableHeaderLabel}>Date</span>
        </div>
        <div className={styles.tableHeaderStatic}>
          <span className={styles.tableHeaderLabel}>Subject</span>
        </div>
        <div className={styles.tableHeaderStatic}>
          <span className={styles.tableHeaderLabel}>Status</span>
        </div>
        <div className={styles.tableHeaderStatic}>
          <span className={styles.tableHeaderLabel}>Tools</span>
        </div>
      </div>

      {questionPageInfo?.totalElements > 0 && (
        <AdminQuestionItems
          questionList={questionList}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          totalPages={questionPageInfo?.totalPages ?? 1}
        />
      )}
    </div>
  );
};

export default AdminQuestion;
