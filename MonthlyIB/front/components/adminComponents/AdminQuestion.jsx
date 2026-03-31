import styles from "./AdminStyle.module.css";

import { useEffect, useMemo, useState } from "react";
import { useQuestionStore } from "@/store/question";
import AdminQuestionItems from "./AdminQuestionItems";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const SORT_LABELS = {
  authorUsername: "ID",
  authorNickName: "Name",
  createAt: "Date",
  subject: "Subject",
  questionStatus: "Status",
};

const STATUS_ORDER = {
  ANSWER_WAIT: 0,
  COMPLETE: 1,
};

const compareText = (left = "", right = "", direction = "asc") => {
  const result = String(left).localeCompare(String(right), "ko", {
    numeric: true,
    sensitivity: "base",
  });
  return direction === "asc" ? result : -result;
};

const compareNumber = (left = 0, right = 0, direction = "asc") => {
  const result = left - right;
  return direction === "asc" ? result : -result;
};

const AdminQuestion = () => {
  const { questionList } = useQuestionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const sortedQuestionList = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return questionList;
    }

    const nextList = [...questionList];
    nextList.sort((left, right) => {
      if (sortConfig.key === "questionStatus") {
        return compareNumber(
          STATUS_ORDER[left.questionStatus] ?? 99,
          STATUS_ORDER[right.questionStatus] ?? 99,
          sortConfig.direction
        );
      }
      return compareText(left[sortConfig.key], right[sortConfig.key], sortConfig.direction);
    });

    return nextList;
  }, [questionList, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedQuestionList.length / pageSize));
  const paginatedQuestionList = sortedQuestionList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key: null, direction: null };
    });
    setCurrentPage(1);
  };

  const renderSortLabel = (key) => {
    if (sortConfig.key !== key) {
      return `${SORT_LABELS[key]} ↕`;
    }
    return `${SORT_LABELS[key]} ${
      sortConfig.direction === "asc" ? "↑" : "↓"
    }`;
  };

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>질문 관리</div>

        <div className={styles.tableToolbar}>
          <div className={styles.tableMeta}>
            <strong>{sortedQuestionList.length}</strong>
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
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("authorUsername")}
          >
            {renderSortLabel("authorUsername")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("authorNickName")}
          >
            {renderSortLabel("authorNickName")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("createAt")}
          >
            {renderSortLabel("createAt")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("subject")}
          >
            {renderSortLabel("subject")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("questionStatus")}
          >
            {renderSortLabel("questionStatus")}
          </button>
          <div className={styles.tableHeaderStatic}>Tools</div>
        </div>

        {sortedQuestionList.length > 0 && (
          <AdminQuestionItems
            questionList={paginatedQuestionList}
            allQuestionList={sortedQuestionList}
            currentPage={currentPage}
            numShowContents={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default AdminQuestion;
