"use client";

import styles from "./AdminStyle.module.css";

import { useState } from "react";
import { useTutoringStore } from "@/store/tutoring";
import AdminScheduleItems from "./AdminScheduleItems";

const AdminSchedule = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { tutoringDateList } = useTutoringStore();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.dashboard_mid_card}>
        <div className={styles.title}>스케쥴링 관리</div>
        <div className={styles.schedule_subtitle}>
          <div className={styles.schedule_username}>ID</div>
          <div className={styles.schedule_nickname}>Name</div>
          <div className={styles.schedule_nickname}>Date</div>
          <div className={styles.schedule_nickname}>Time</div>
          <div className={styles.schedule_nickname}>Status</div>
          <div className={styles.schedule_functions}>Tools</div>
        </div>

        <AdminScheduleItems
          tutoringDateList={tutoringDateList?.tutoring?.data}
          currentPage={currentPage}
          numShowContents={10}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default AdminSchedule;
