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
  const detailView = useMemo(
    () => (detailData ? buildHistoryDetailView(detailData) : null),
    [detailData]
  );

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

                {detailView?.isTopicGuide ? (
                  <TopicGuideHistoryDetail detailData={detailData} detailView={detailView} />
                ) : (
                  <DefaultHistoryDetail detailData={detailData} />
                )}
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const DefaultHistoryDetail = ({ detailData }) => (
  <div className={styles.detailsStack}>
    <details className={styles.detailBox} open>
      <summary>요약</summary>
      <div className={styles.detailBody}>
        <p className={styles.summaryText}>
          {detailData.summary || "요약 정보가 없습니다."}
        </p>
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

    <AttachmentDetail detailData={detailData} />
  </div>
);

const TopicGuideHistoryDetail = ({ detailData, detailView }) => {
  const guide = detailView.topicGuide;

  return (
    <div className={styles.detailsStack}>
      <section className={styles.historySection}>
        <div className={styles.historySectionHeader}>
          <span>요약</span>
          <h4>{detailData.summary || guide.title || "AI IA 가이드 생성"}</h4>
          <p>
            AI 가이드 결과 페이지와 같은 카드 구조로 핵심 요청과 응답 원문을
            확인합니다.
          </p>
        </div>
      </section>

      <section className={styles.historySection}>
        <div className={styles.historySectionHeader}>
          <span>입력 원문</span>
          <h4>학생 요청 정보</h4>
          <p>가이드 생성에 사용된 과목, 관심 영역, 선택 주제입니다.</p>
        </div>

        <div className={styles.requestGrid}>
          <ReadableMetaCard label="Subject" value={guide.subject} />
          <ReadableMetaCard label="Interest Area" value={guide.interestTopic} />
          <ReadableMetaCard label="Selected Topic" value={guide.topicTitle} />
        </div>

        {guide.rawTopic ? (
          <div className={styles.requestPayloadCard}>
            <span>Selected Topic Detail</span>
            <ReadableValue value={guide.rawTopic} />
          </div>
        ) : null}
      </section>

      <section className={`${styles.historySection} ${styles.guideResultSection}`}>
        <div className={styles.historySectionHeader}>
          <span>AI 응답 원문</span>
          <h4>{guide.title}</h4>
          <p>생성된 가이드 본문을 결과 페이지와 같은 형태로 정리했습니다.</p>
        </div>

        <div className={styles.guideSheet}>
          <section className={styles.guideHeroSection}>
            <div className={styles.guideSectionLabel}>Teacher Overview</div>
            <p className={styles.guideOverviewText}>
              {guide.overview || "개요가 아직 생성되지 않았습니다."}
            </p>
          </section>

          <section className={styles.guideDualGrid}>
            <GuideListCard
              title="Recommended Research Questions"
              subtitle="글의 논지를 선명하게 만들 핵심 질문"
              items={guide.researchQuestions}
              variant="question"
              emptyText="연구 질문이 아직 없습니다."
            />
            <GuideListCard
              title="Key Talking Points"
              subtitle="본문에서 반드시 다뤄야 할 포인트"
              items={guide.keyPoints}
              variant="point"
              emptyText="핵심 포인트가 아직 없습니다."
            />
          </section>

          <section className={styles.guideStructureSection}>
            <div className={styles.guideSectionLabel}>Suggested Essay Structure</div>
            <div className={styles.guideStructureGrid}>
              <StructureCard stage="Introduction" body={guide.structure.introduction} />
              <StructureCard stage="Body" body={guide.structure.body} />
              <StructureCard stage="Conclusion" body={guide.structure.conclusion} />
            </div>
          </section>

          <section className={styles.guideTipsSection}>
            <div className={styles.guideSectionLabel}>Teacher's Margin Notes</div>
            <div className={styles.guideTipStack}>
              {guide.tips.length > 0 ? (
                guide.tips.map((tip, index) => (
                  <article key={`${tip}-${index}`} className={styles.guideTipCard}>
                    <span className={styles.guideTipIndex}>
                      Tip {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className={styles.guideTipText}>{tip}</p>
                  </article>
                ))
              ) : (
                <article className={styles.guideTipCard}>
                  <span className={styles.guideTipIndex}>Tip 01</span>
                  <p className={styles.guideTipText}>추가 팁이 아직 생성되지 않았습니다.</p>
                </article>
              )}
            </div>
          </section>

          {guide.extraEntries.length > 0 ? (
            <section className={styles.guideExtraSection}>
              <div className={styles.guideSectionLabel}>Additional Notes</div>
              <div className={styles.guideExtraStack}>
                {guide.extraEntries.map(([key, value]) => (
                  <article key={key} className={styles.guideExtraCard}>
                    <h5>{prettifyKey(key)}</h5>
                    <ReadableValue value={value} />
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <details className={styles.detailBox}>
        <summary>JSON 원본 보기</summary>
        <div className={styles.detailBody}>
          <div className={styles.rawGrid}>
            <div>
              <h5>입력 원문</h5>
              <pre className={styles.codeBlock}>
                {formatJsonText(detailData.requestPayloadJson)}
              </pre>
            </div>
            <div>
              <h5>AI 응답 원문</h5>
              <pre className={styles.codeBlock}>
                {formatJsonText(detailData.responsePayloadJson)}
              </pre>
            </div>
          </div>
        </div>
      </details>

      <AttachmentDetail detailData={detailData} />
    </div>
  );
};

const ReadableMetaCard = ({ label, value }) => (
  <div className={styles.readableMetaCard}>
    <span>{label}</span>
    <strong>{value || "-"}</strong>
  </div>
);

const GuideListCard = ({ title, subtitle, items, variant, emptyText }) => (
  <article className={styles.guideListCard}>
    <div className={styles.guideListHeader}>
      <h5>{title}</h5>
      <p>{subtitle}</p>
    </div>
    <ol className={styles.guideListItems}>
      {items.length > 0 ? (
        items.map((item, index) => (
          <li key={`${item}-${index}`} className={styles.guideListItem}>
            <span
              className={
                variant === "question"
                  ? styles.guideListMarkerQuestion
                  : styles.guideListMarkerPoint
              }
            >
              {variant === "question" ? `Q${index + 1}` : `${index + 1}`}
            </span>
            <p>{item}</p>
          </li>
        ))
      ) : (
        <li className={styles.guideListItem}>
          <span className={styles.guideListMarkerPoint}>-</span>
          <p>{emptyText}</p>
        </li>
      )}
    </ol>
  </article>
);

const StructureCard = ({ stage, body }) => (
  <article className={styles.guideStructureCard}>
    <span>{stage}</span>
    <p>{body || "내용이 아직 생성되지 않았습니다."}</p>
  </article>
);

const AttachmentDetail = ({ detailData }) => (
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
        <p className={styles.summaryText}>첨부 URL이 없습니다.</p>
      )}
    </div>
  </details>
);

const ReadableValue = ({ value }) => {
  if (value === null || typeof value === "undefined" || value === "") {
    return <p className={styles.readableText}>기록 없음</p>;
  }

  if (Array.isArray(value)) {
    return (
      <ul className={styles.readableList}>
        {value.map((item, index) => (
          <li key={`${index}-${stringifyText(item).slice(0, 24)}`}>
            <ReadableValue value={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <div className={styles.readableObject}>
        {Object.entries(value).map(([key, nestedValue]) => (
          <div key={key} className={styles.readableRow}>
            <span>{prettifyKey(key)}</span>
            <div>
              <ReadableValue value={nestedValue} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <p className={styles.readableText}>{String(value)}</p>;
};

const GUIDE_FIELDS = new Set([
  "title",
  "overview",
  "researchQuestions",
  "keyPoints",
  "structure",
  "tips",
]);

const buildHistoryDetailView = (detailData) => {
  const requestPayload = parseJsonValue(detailData.requestPayloadJson);
  const responsePayload = parseJsonValue(detailData.responsePayloadJson);
  const isTopicGuide =
    detailData.toolType === "IA_COACHING" &&
    detailData.actionType === "TOPIC_GUIDE";

  return {
    requestPayload,
    responsePayload,
    isTopicGuide,
    topicGuide: isTopicGuide
      ? normalizeTopicGuideHistory(detailData, requestPayload, responsePayload)
      : null,
  };
};

const normalizeTopicGuideHistory = (detailData, requestPayload, responsePayload) => {
  const guide =
    responsePayload?.guide && typeof responsePayload.guide === "object"
      ? responsePayload.guide
      : responsePayload && typeof responsePayload === "object"
        ? responsePayload
        : {};
  const topic =
    requestPayload?.topic && typeof requestPayload.topic === "object"
      ? requestPayload.topic
      : requestPayload?.topic;

  return {
    title: firstNonEmpty(
      guide.title,
      topic && typeof topic === "object" ? topic.title : null,
      detailData.summary,
      "IA Topic Guide"
    ),
    subject: firstNonEmpty(requestPayload?.subject, detailData.subject, "IB Subject"),
    interestTopic: firstNonEmpty(
      requestPayload?.interestTopic,
      detailData.interestTopic,
      "Not specified"
    ),
    topicTitle: firstNonEmpty(
      topic && typeof topic === "object" ? topic.title : null,
      topic && typeof topic === "object" ? topic.question : null,
      typeof topic === "string" ? topic : null,
      guide.title,
      detailData.summary,
      "Selected topic"
    ),
    overview: stringifyText(guide.overview),
    researchQuestions: listify(guide.researchQuestions),
    keyPoints: listify(guide.keyPoints),
    structure: {
      introduction: stringifyText(guide?.structure?.introduction),
      body: stringifyText(guide?.structure?.body),
      conclusion: stringifyText(guide?.structure?.conclusion),
    },
    tips: listify(guide.tips),
    extraEntries: Object.entries(guide).filter(([key]) => !GUIDE_FIELDS.has(key)),
    rawTopic: topic,
  };
};

const parseJsonValue = (value) => {
  if (!value) {
    return null;
  }
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const firstNonEmpty = (...values) => {
  const found = values.find((value) => {
    if (value === null || typeof value === "undefined") {
      return false;
    }
    return String(value).trim().length > 0;
  });
  return found === null || typeof found === "undefined" ? "" : String(found);
};

const listify = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map(stringifyText).filter(Boolean);
  }
  return [stringifyText(value)].filter(Boolean);
};

const stringifyText = (value) => {
  if (value === null || typeof value === "undefined") {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const prettifyKey = (key) =>
  String(key)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());

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
