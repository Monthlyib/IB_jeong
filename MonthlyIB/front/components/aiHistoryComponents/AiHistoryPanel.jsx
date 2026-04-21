"use client";

import { useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading";
import {
  getAdminAiHistory,
  getAdminAiHistoryDetail,
  getMyAiHistory,
  getMyAiHistoryDetail,
} from "@/apis/aiHistoryAPI";
import styles from "./AiHistoryPanel.module.css";

const TOOL_LABELS = {
  IA_COACHING: "AI IA/EE 코칭",
  IO_PRACTICE: "AI IO 연습",
  CHAPTER_TEST: "AI Chapter Test",
  DESCRIPTIVE_TEST: "AI 서술형 평가",
};

const ACTION_LABELS = {
  TOPIC_RECOMMEND: "주제 추천",
  TOPIC_GUIDE: "가이드 생성",
  ENGLISH_CHAT: "영어 코칭",
  VOICE_FEEDBACK: "음성 피드백",
  QUIZ_START: "테스트 시작",
  QUIZ_RESULT: "테스트 결과",
  ANSWER_SUBMIT: "답안 제출",
  FEEDBACK_GENERATE: "피드백 생성",
};

const STATUS_LABELS = {
  SUCCESS: "성공",
  FAILED: "실패",
};

const DEFAULT_PAGE_SIZE = 10;

const AiHistoryPanel = ({
  mode = "me",
  userId,
  session,
  title = "AI 히스토리",
  description = "최근 AI 응답 기록을 확인할 수 있습니다.",
}) => {
  const [toolType, setToolType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detailData, setDetailData] = useState(null);

  const isReady = useMemo(() => {
    if (!session?.accessToken) {
      return false;
    }
    if (mode === "admin") {
      return Boolean(userId);
    }
    return true;
  }, [mode, session?.accessToken, userId]);

  useEffect(() => {
    setCurrentPage(0);
    setSelectedHistoryId(null);
    setDetailData(null);
    setDetailError("");
  }, [toolType, userId, mode]);

  useEffect(() => {
    if (!isReady) {
      setItems([]);
      setPageInfo(null);
      setSelectedHistoryId(null);
      setDetailData(null);
      setDetailError("");
      return;
    }

    const load = async () => {
      setListLoading(true);
      setListError("");
      setItems([]);
      setPageInfo(null);
      try {
        const response =
          mode === "admin"
            ? await getAdminAiHistory(
                {
                  userId,
                  toolType,
                  page: currentPage,
                  size: DEFAULT_PAGE_SIZE,
                },
                session
              )
            : await getMyAiHistory(
                {
                  toolType,
                  page: currentPage,
                  size: DEFAULT_PAGE_SIZE,
                },
                session
              );

        setItems(response?.data ?? []);
        setPageInfo(response?.pageInfo ?? null);
      } catch (error) {
        setItems([]);
        setPageInfo(null);
        setListError(
          error?.response?.data?.message || "AI 히스토리를 불러오지 못했습니다."
        );
      } finally {
        setListLoading(false);
      }
    };

    load();
  }, [currentPage, isReady, mode, session, toolType, userId]);

  useEffect(() => {
    if (!selectedHistoryId || !isReady) {
      setDetailData(null);
      setDetailError("");
      return;
    }

    const loadDetail = async () => {
      setDetailLoading(true);
      setDetailError("");
      setDetailData(null);
      try {
        const response =
          mode === "admin"
            ? await getAdminAiHistoryDetail(selectedHistoryId, session)
            : await getMyAiHistoryDetail(selectedHistoryId, session);

        setDetailData(response?.data ?? null);
      } catch (error) {
        setDetailData(null);
        setDetailError(
          error?.response?.data?.message || "AI 히스토리 상세를 불러오지 못했습니다."
        );
      } finally {
        setDetailLoading(false);
      }
    };

    loadDetail();
  }, [isReady, mode, selectedHistoryId, session]);

  if (!isReady) {
    return (
      <div className={styles.feedback}>
        로그인 정보가 확인되면 AI 히스토리를 불러옵니다.
      </div>
    );
  }

  const totalPages = pageInfo?.totalPages ?? 0;
  const currentPageNumber = (pageInfo?.page ?? currentPage) + 1;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeaderText}>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>

        <div className={styles.filterWrap}>
          <label htmlFor={`ai-history-filter-${mode}`}>Tool Filter</label>
          <select
            id={`ai-history-filter-${mode}`}
            className={styles.filterSelect}
            value={toolType}
            onChange={(e) => setToolType(e.target.value)}
          >
            <option value="">전체 도구</option>
            {Object.entries(TOOL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {listLoading ? (
        <div className={styles.loadingBlock}>
          <Loading variant="inline" label="AI 히스토리를 불러오는 중입니다." />
        </div>
      ) : listError ? (
        <div className={styles.feedback}>{listError}</div>
      ) : items.length === 0 ? (
        <div className={styles.feedback}>
          아직 기록된 AI 히스토리가 없습니다.
        </div>
      ) : (
        <>
          <div className={styles.cardList}>
            {items.map((item) => (
              <button
                key={item.historyId}
                type="button"
                className={styles.cardButton}
                onClick={() => setSelectedHistoryId(item.historyId)}
              >
                <div className={styles.cardHead}>
                  <div className={styles.cardMeta}>
                    <span className={styles.toolBadge}>
                      {TOOL_LABELS[item.toolType] || item.toolType}
                    </span>
                    <span className={styles.actionBadge}>
                      {ACTION_LABELS[item.actionType] || item.actionType}
                    </span>
                    <span
                      className={`${styles.statusBadge} ${
                        item.status === "SUCCESS"
                          ? styles.statusSuccess
                          : styles.statusFailed
                      }`}
                    >
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </div>
                  <span className={styles.createdAt}>
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>

                <p className={styles.cardTitle}>{item.title}</p>
                <p className={styles.cardSummary}>
                  {item.summary || "상세 내용을 열어 원문 기록을 확인할 수 있습니다."}
                </p>

                <div className={styles.cardFooter}>
                  {item.subject ? <span>과목: {item.subject}</span> : null}
                  {item.chapter ? <span>챕터: {item.chapter}</span> : null}
                  {item.interestTopic ? <span>주제: {item.interestTopic}</span> : null}
                  {typeof item.score === "number" ? (
                    <span>
                      점수: {item.score}
                      {typeof item.maxScore === "number" ? ` / ${item.maxScore}` : ""}
                    </span>
                  ) : null}
                  {typeof item.durationSeconds === "number" && item.durationSeconds > 0 ? (
                    <span>소요: {formatDuration(item.durationSeconds)}</span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                {currentPageNumber} / {totalPages} 페이지
              </span>
              <div className={styles.paginationButtons}>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  disabled={currentPageNumber <= 1}
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.max(totalPages - 1, 0))
                    )
                  }
                  disabled={currentPageNumber >= totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {selectedHistoryId ? (
        <div
          className={styles.modalBackdrop}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedHistoryId(null);
            }
          }}
        >
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div>
                <h3>{detailData?.title || "AI 히스토리 상세"}</h3>
                <p>
                  {detailData
                    ? `${TOOL_LABELS[detailData.toolType] || detailData.toolType} · ${
                        ACTION_LABELS[detailData.actionType] || detailData.actionType
                      }`
                    : "기록 원문과 첨부 메타를 확인할 수 있습니다."}
                </p>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedHistoryId(null)}
              >
                ×
              </button>
            </div>

            {detailLoading ? (
              <div className={styles.modalLoadingBlock}>
                <Loading variant="inline" label="AI 히스토리 상세를 불러오는 중입니다." />
              </div>
            ) : detailError ? (
              <div className={styles.feedback}>{detailError}</div>
            ) : detailData ? (
              <>
                <div className={styles.modalMetaGrid}>
                  {mode === "admin" ? (
                    <div className={styles.metaCard}>
                      <span>사용자</span>
                      <strong>
                        {detailData.nickName || "-"} ({detailData.username || "-"})
                      </strong>
                    </div>
                  ) : null}
                  <div className={styles.metaCard}>
                    <span>생성 시각</span>
                    <strong>{formatDateTime(detailData.createdAt)}</strong>
                  </div>
                  <div className={styles.metaCard}>
                    <span>상태</span>
                    <strong>{STATUS_LABELS[detailData.status] || detailData.status}</strong>
                  </div>
                  {detailData.subject ? (
                    <div className={styles.metaCard}>
                      <span>과목</span>
                      <strong>{detailData.subject}</strong>
                    </div>
                  ) : null}
                  {detailData.chapter ? (
                    <div className={styles.metaCard}>
                      <span>챕터</span>
                      <strong>{detailData.chapter}</strong>
                    </div>
                  ) : null}
                  {detailData.interestTopic ? (
                    <div className={styles.metaCard}>
                      <span>주제</span>
                      <strong>{detailData.interestTopic}</strong>
                    </div>
                  ) : null}
                  {typeof detailData.score === "number" ? (
                    <div className={styles.metaCard}>
                      <span>점수</span>
                      <strong>
                        {detailData.score}
                        {typeof detailData.maxScore === "number"
                          ? ` / ${detailData.maxScore}`
                          : ""}
                      </strong>
                    </div>
                  ) : null}
                  {typeof detailData.durationSeconds === "number" &&
                  detailData.durationSeconds > 0 ? (
                    <div className={styles.metaCard}>
                      <span>소요 시간</span>
                      <strong>{formatDuration(detailData.durationSeconds)}</strong>
                    </div>
                  ) : null}
                </div>

                <div className={styles.detailsStack}>
                  <details className={styles.detailBox} open>
                    <summary>요약</summary>
                    <div className={styles.detailBody}>
                      <pre className={styles.codeBlock}>
                        {detailData.summary || "요약 정보가 없습니다."}
                      </pre>
                    </div>
                  </details>

                  <details className={styles.detailBox}>
                    <summary>입력 원문</summary>
                    <div className={styles.detailBody}>
                      <pre className={styles.codeBlock}>
                        {formatJsonText(detailData.requestPayloadJson)}
                      </pre>
                    </div>
                  </details>

                  <details className={styles.detailBox}>
                    <summary>AI 응답 원문</summary>
                    <div className={styles.detailBody}>
                      <pre className={styles.codeBlock}>
                        {formatJsonText(detailData.responsePayloadJson)}
                      </pre>
                    </div>
                  </details>

                  <details className={styles.detailBox}>
                    <summary>첨부/파일 메타</summary>
                    <div className={styles.detailBody}>
                      {detailData.attachmentUrls?.length ? (
                        <div className={styles.attachmentList}>
                          {detailData.attachmentUrls.map((url) => (
                            <a key={url} href={url} target="_blank" rel="noreferrer">
                              {url}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <pre className={styles.codeBlock}>첨부 URL이 없습니다.</pre>
                      )}
                    </div>
                  </details>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const formatDateTime = (value) => {
  if (!value) return "기록 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "기록 없음";
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (seconds) => {
  const total = Number(seconds) || 0;
  const minutes = Math.floor(total / 60);
  const remain = total % 60;
  if (minutes <= 0) {
    return `${remain}초`;
  }
  return `${minutes}분 ${remain}초`;
};

const formatJsonText = (value) => {
  if (!value) {
    return "기록 없음";
  }
  if (typeof value !== "string") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

export default AiHistoryPanel;
