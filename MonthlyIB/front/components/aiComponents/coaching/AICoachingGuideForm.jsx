/* eslint-disable react/prop-types */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AICoachingGuideForm.module.css";

const KEY = "ai_coaching_guide_payload";

const KNOWN_FIELDS = new Set([
  "title",
  "overview",
  "researchQuestions",
  "keyPoints",
  "structure",
  "tips",
]);

export default function AICoachingGuideForm() {
  const router = useRouter();
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = window?.sessionStorage?.getItem(KEY);
      if (!stored) {
        setError("가이드 데이터를 찾을 수 없습니다. 이전 화면에서 가이드를 생성해 주세요.");
        return;
      }
      setRaw(JSON.parse(stored));
    } catch (e) {
      console.error("Guide parse error:", e);
      setError("가이드 데이터를 해석하는 중 오류가 발생했습니다.");
    }
  }, []);

  const documentData = useMemo(() => normalizeGuideDocument(raw), [raw]);

  return (
    <main className={styles.guideContainer} role="document" aria-label="IA Guide">
      <header className={styles.guideHeader}>
        <div className={styles.headerCard}>
          <div className={styles.headerTopRow}>
            <div className={styles.headerMain}>
              <p className={styles.headerEyebrow}>IB Individual Assessment Planning Notes</p>
              <h1 className={styles.guideTitle}>{documentData.title}</h1>
            </div>

            <button
              type="button"
              className={styles.guideBtn}
              onClick={() => router.back()}
            >
              돌아가기
            </button>
          </div>

          <div className={styles.metaGrid}>
            <MetaCard label="Subject" value={documentData.subject} />
            <MetaCard label="Interest Area" value={documentData.interestTopic} />
            <MetaCard label="Selected Topic" value={documentData.topicTitle} />
          </div>
        </div>
      </header>

      <div className={styles.guideMain}>
        {error && (
          <div className={styles.guideError} role="alert">
            {error}
          </div>
        )}

        {!error && !raw && (
          <div className={styles.guideLoading}>가이드 데이터를 불러오는 중...</div>
        )}

        {!error && raw && (
          <div className={styles.guideSheet}>
            <section className={styles.heroSection}>
              <div className={styles.sectionLabel}>Teacher Overview</div>
              <p className={styles.overviewText}>
                {documentData.overview || "개요가 아직 생성되지 않았습니다."}
              </p>
            </section>

            <section className={styles.dualGrid}>
              <GuideListCard
                title="Recommended Research Questions"
                subtitle="글의 논지를 선명하게 만들 핵심 질문"
                items={documentData.researchQuestions}
                variant="question"
                emptyText="연구 질문이 아직 없습니다."
              />
              <GuideListCard
                title="Key Talking Points"
                subtitle="본문에서 반드시 다뤄야 할 포인트"
                items={documentData.keyPoints}
                variant="point"
                emptyText="핵심 포인트가 아직 없습니다."
              />
            </section>

            <section className={styles.structureSection}>
              <div className={styles.sectionLabel}>Suggested Essay Structure</div>
              <div className={styles.structureGrid}>
                <StructureCard
                  stage="Introduction"
                  body={documentData.structure.introduction}
                />
                <StructureCard
                  stage="Body"
                  body={documentData.structure.body}
                />
                <StructureCard
                  stage="Conclusion"
                  body={documentData.structure.conclusion}
                />
              </div>
            </section>

            <section className={styles.tipsSection}>
              <div className={styles.sectionLabel}>Teacher's Margin Notes</div>
              <div className={styles.tipStack}>
                {documentData.tips.length > 0 ? (
                  documentData.tips.map((tip, index) => (
                    <article key={`${tip}-${index}`} className={styles.tipCard}>
                      <span className={styles.tipIndex}>
                        Tip {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className={styles.tipText}>{tip}</p>
                    </article>
                  ))
                ) : (
                  <article className={styles.tipCard}>
                    <span className={styles.tipIndex}>Tip 01</span>
                    <p className={styles.tipText}>추가 팁이 아직 생성되지 않았습니다.</p>
                  </article>
                )}
              </div>
            </section>

            {documentData.extraEntries.length > 0 && (
              <section className={styles.extraSection}>
                <div className={styles.sectionLabel}>Additional Notes</div>
                <div className={styles.extraStack}>
                  {documentData.extraEntries.map(([key, value]) => (
                    <div key={key} className={styles.extraCard}>
                      <h2 className={styles.extraHeading}>{prettifyKey(key)}</h2>
                      <RecursiveNode value={value} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function normalizeGuideDocument(raw) {
  const meta = raw?.__meta ?? {};
  const guide = raw?.guide && typeof raw.guide === "object" ? raw.guide : raw ?? {};

  return {
    title: firstNonEmpty(guide.title, meta.topicTitle, "IA Topic Guide"),
    subject: firstNonEmpty(meta.subject, "IB Subject"),
    interestTopic: firstNonEmpty(meta.interestTopic, "Not specified"),
    topicTitle: firstNonEmpty(meta.topicTitle, guide.title, "Selected topic"),
    overview: stringifyText(guide.overview),
    researchQuestions: listify(guide.researchQuestions),
    keyPoints: listify(guide.keyPoints),
    structure: {
      introduction: stringifyText(guide?.structure?.introduction),
      body: stringifyText(guide?.structure?.body),
      conclusion: stringifyText(guide?.structure?.conclusion),
    },
    tips: listify(guide.tips),
    extraEntries: Object.entries(guide).filter(([key]) => !KNOWN_FIELDS.has(key)),
  };
}

function MetaCard({ label, value }) {
  return (
    <div className={styles.metaCard}>
      <span className={styles.metaLabel}>{label}</span>
      <strong className={styles.metaValue}>{value}</strong>
    </div>
  );
}

function GuideListCard({ title, subtitle, items, variant, emptyText }) {
  return (
    <article className={styles.listCard}>
      <div className={styles.listCardHeader}>
        <h2 className={styles.listCardTitle}>{title}</h2>
        <p className={styles.listCardSubtitle}>{subtitle}</p>
      </div>
      <ol className={styles.listItems}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={`${item}-${index}`} className={styles.listItem}>
              <span className={styles[`listMarker${capitalize(variant)}`]}>
                {variant === "question" ? `Q${index + 1}` : `${index + 1}`}
              </span>
              <p className={styles.listItemText}>{item}</p>
            </li>
          ))
        ) : (
          <li className={styles.listItem}>
            <span className={styles.listMarkerPoint}>-</span>
            <p className={styles.listItemText}>{emptyText}</p>
          </li>
        )}
      </ol>
    </article>
  );
}

function StructureCard({ stage, body }) {
  return (
    <article className={styles.structureCard}>
      <div className={styles.structureStage}>{stage}</div>
      <p className={styles.structureText}>
        {body || "구조 안내가 아직 생성되지 않았습니다."}
      </p>
    </article>
  );
}

function RecursiveNode({ value }) {
  if (Array.isArray(value)) {
    return (
      <ul className={styles.fallbackList}>
        {value.map((item, index) => (
          <li key={index} className={styles.fallbackListItem}>
            <RecursiveNode value={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className={styles.fallbackObject}>
        {Object.entries(value).map(([key, nestedValue]) => (
          <div key={key} className={styles.fallbackRow}>
            <div className={styles.fallbackKey}>{prettifyKey(key)}</div>
            <div className={styles.fallbackValue}>
              <RecursiveNode value={nestedValue} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <p className={styles.fallbackText}>{stringifyText(value)}</p>;
}

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || values.find(Boolean) || "";
}

function listify(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => stringifyText(item))
      .filter(Boolean);
  }
  return [stringifyText(value)].filter(Boolean);
}

function stringifyText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function prettifyKey(key) {
  return String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
