"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./AdminStyle.module.css";
import {
  ADMIN_MAIL_JOBS_REFRESH_EVENT,
  mailGetJobs,
} from "@/apis/mail";
import { getCookie } from "@/apis/cookies";

const STATUS_LABELS = {
  QUEUED: "대기 중",
  SENT: "전송 완료",
  FAILED: "실패",
};

const formatDateTime = (value) => {
  if (!value) {
    return "기록 없음";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "기록 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const AdminMailJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const session = useMemo(() => {
    const accessToken = getCookie("accessToken");
    return accessToken ? { accessToken } : null;
  }, []);

  const fetchMailJobs = useCallback(async () => {
    if (!session?.accessToken) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      const response = await mailGetJobs(session);
      setJobs(response?.data ?? []);
    } catch (error) {
      console.error("Failed to load admin mail jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchMailJobs();

    const intervalId = window.setInterval(fetchMailJobs, 8000);
    const refreshListener = () => {
      fetchMailJobs();
    };
    window.addEventListener(ADMIN_MAIL_JOBS_REFRESH_EVENT, refreshListener);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(ADMIN_MAIL_JOBS_REFRESH_EVENT, refreshListener);
    };
  }, [fetchMailJobs]);

  return (
    <div className={styles.dashboard_mid_card}>
      <div className={styles.title}>최근 메일 작업</div>
      <div className={styles.mailJobsDescription}>
        메일 전송 요청 이후 상태가 자동으로 갱신됩니다.
      </div>

      {loading ? (
        <div className={styles.emptyTableState}>메일 작업 상태를 불러오는 중입니다.</div>
      ) : jobs.length === 0 ? (
        <div className={styles.emptyTableState}>최근 메일 작업 내역이 없습니다.</div>
      ) : (
        <div className={styles.mailJobList}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.mailJobItem}>
              <div className={styles.mailJobRow}>
                <div className={styles.mailJobSubject}>{job.subject}</div>
                <span
                  className={`${styles.mailJobStatus} ${
                    styles[`mailJobStatus${job.status}`]
                  }`}
                >
                  {STATUS_LABELS[job.status] ?? job.status}
                </span>
              </div>
              <div className={styles.mailJobMeta}>
                <span>{job.targetName || job.targetEmail}</span>
                <span>{job.targetEmail}</span>
                <span>{formatDateTime(job.updateAt || job.createAt)}</span>
              </div>
              <div className={styles.mailJobMeta}>
                <span>첨부 {job.attachmentCount}개</span>
                <span>본문 이미지 {job.inlineImageCount}개</span>
              </div>
              {job.errorMessage ? (
                <div className={styles.mailJobError}>{job.errorMessage}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMailJobs;
