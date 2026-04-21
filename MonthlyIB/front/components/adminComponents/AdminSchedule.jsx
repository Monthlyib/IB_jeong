"use client";

import styles from "./AdminStyle.module.css";

import { useEffect, useMemo, useState } from "react";
import { useTutoringStore } from "@/store/tutoring";
import AdminScheduleItems from "./AdminScheduleItems";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const SORT_LABELS = {
  requestUsername: "ID",
  requestUserNickName: "Name",
  date: "Date",
  time: "Time",
  tutoringStatus: "Status",
  googleCalendarSyncStatus: "Calendar",
};

const STATUS_ORDER = {
  WAIT: 0,
  CONFIRM: 1,
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

const AdminSchedule = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const { tutoringDateList } = useTutoringStore();

  const scheduleList = tutoringDateList?.tutoring?.data ?? [];

  const sortedScheduleList = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return scheduleList;
    }

    const nextList = [...scheduleList];

    nextList.sort((left, right) => {
      switch (sortConfig.key) {
        case "requestUsername":
          return compareText(
            left.requestUsername,
            right.requestUsername,
            sortConfig.direction
          );
        case "requestUserNickName":
          return compareText(
            left.requestUserNickName,
            right.requestUserNickName,
            sortConfig.direction
          );
        case "time": {
          const leftTime = (left.hour ?? 0) * 60 + (left.minute ?? 0);
          const rightTime = (right.hour ?? 0) * 60 + (right.minute ?? 0);
          const timeCompare = compareNumber(
            leftTime,
            rightTime,
            sortConfig.direction
          );
          if (timeCompare !== 0) return timeCompare;
          return compareText(left.date, right.date, sortConfig.direction);
        }
        case "tutoringStatus": {
          const statusCompare = compareNumber(
            STATUS_ORDER[left.tutoringStatus] ?? 99,
            STATUS_ORDER[right.tutoringStatus] ?? 99,
            sortConfig.direction
          );
          if (statusCompare !== 0) return statusCompare;
          return compareText(
            left.requestUserNickName,
            right.requestUserNickName,
            "asc"
          );
        }
        case "date":
        default: {
          const dateCompare = compareText(
            left.date,
            right.date,
            sortConfig.direction
          );
          if (dateCompare !== 0) return dateCompare;
          const leftTime = (left.hour ?? 0) * 60 + (left.minute ?? 0);
          const rightTime = (right.hour ?? 0) * 60 + (right.minute ?? 0);
          return compareNumber(leftTime, rightTime, sortConfig.direction);
        }
      }
    });

    return nextList;
  }, [scheduleList, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedScheduleList.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedScheduleList = sortedScheduleList.slice(
    startIndex,
    startIndex + pageSize
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
        return {
          key,
          direction: "asc",
        };
      }

      if (prev.direction === "asc") {
        return {
          key,
          direction: "desc",
        };
      }

      return {
        key: null,
        direction: null,
      };
    });
    setCurrentPage(1);
  };

  const renderSortLabel = (key) => {
    const arrow =
      sortConfig.key !== key
        ? "↕"
        : sortConfig.direction === "asc"
          ? "↑"
          : "↓";

    return (
      <>
        <span className={styles.tableHeaderLabel}>{SORT_LABELS[key]}</span>
        <span className={styles.tableHeaderArrow} aria-hidden="true">
          {arrow}
        </span>
      </>
    );
  };

  return (
    <>
      <div className={`${styles.dashboard_mid_card} ${styles.managementCard}`}>
        <div className={styles.title}>스케줄링 관리</div>

        <div className={styles.tableToolbar}>
          <div className={styles.tableMeta}>
            <strong>{sortedScheduleList.length}</strong>
            <span>개의 예약 요청</span>
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

        <div className={`${styles.schedule_subtitle} ${styles.scheduleGrid}`}>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("requestUsername")}
          >
            {renderSortLabel("requestUsername")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("requestUserNickName")}
          >
            {renderSortLabel("requestUserNickName")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("date")}
          >
            {renderSortLabel("date")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("time")}
          >
            {renderSortLabel("time")}
          </button>
          <button
            type="button"
            className={styles.tableHeaderButton}
            onClick={() => handleSort("tutoringStatus")}
          >
            {renderSortLabel("tutoringStatus")}
          </button>
          <div className={styles.tableHeaderStatic}>
            <span className={styles.tableHeaderLabel}>Calendar</span>
          </div>
          <div className={styles.tableHeaderStatic}>
            <span className={styles.tableHeaderLabel}>Tools</span>
          </div>
        </div>

        <AdminScheduleItems
          tutoringDateList={paginatedScheduleList}
          allTutoringDateList={sortedScheduleList}
          currentPage={currentPage}
          numShowContents={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default AdminSchedule;
