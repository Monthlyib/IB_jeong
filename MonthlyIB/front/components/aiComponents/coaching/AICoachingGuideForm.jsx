

/* eslint-disable react/prop-types */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AICoachingGuideForm.module.css";

/**
 * AICoachingGuideForm (Next.js Client Component)
 * - Reads dynamic guide JSON from sessionStorage key: "ai_coaching_guide_payload"
 * - Recursively renders nested structure with depth-based classes
 * - Uses next/navigation router for basic navigation patterns
 */

const KEY = "ai_coaching_guide_payload";

export default function AICoachingGuideForm() {
  const router = useRouter();
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const s = window?.sessionStorage?.getItem(KEY);
      if (!s) {
        setError("가이드 데이터를 찾을 수 없습니다. 이전 화면에서 가이드를 생성해 주세요.");
        return;
      }
      setRaw(JSON.parse(s));
    } catch (e) {
      console.error("Guide parse error:", e);
      setError("가이드 데이터를 해석하는 중 오류가 발생했습니다.");
    }
  }, []);

  const content = useMemo(() => raw, [raw]);

  return (
    <div className={styles.guideContainer} role="document" aria-label="IA Guide">
      <header className={styles.guideHeader}>
        <div className={styles.guideHeaderRow}>
          <h1 className={styles.guideTitle}>IA Topic Guide</h1>
          <div className={styles.guideActions}>
            <button
              type="button"
              className={`${styles.guideBtn} ${styles.guideBtnSecondary}`}
              onClick={() => router.back()}
            >
              돌아가기
            </button>
          </div>
        </div>
      </header>

      {/* Main content strictly lives under the header */}
      <main className={styles.guideMain} role="main">
        {error && (
          <div className={styles.guideError} role="alert">
            {error}
          </div>
        )}

        {!error && !content && (
          <div className={styles.guideLoading}>가이드 데이터를 불러오는 중...</div>
        )}

        {!error && content && (
          <div className={styles.guideBody}>
            <RecursiveNode label={null} value={content} depth={0} />
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Recursive renderer for any JSON structure
 */
function RecursiveNode({ label, value, depth }) {
  const isArray = Array.isArray(value);
  const isObject = !isArray && typeof value === "object" && value !== null;
  const isPrimitive = !isArray && !isObject;

  const depthClass = styles[`guide-depth-${depth}`] || "";
  const rowClass = `${styles.guideRow} ${depthClass}`;

  if (isPrimitive) {
    return (
      <div className={rowClass} data-depth={depth}>
        {label != null && (
          <div className={styles.guideKey} title={String(label)}>
            {String(label)}
          </div>
        )}
        <div className={styles.guideLeaf}>{String(value)}</div>
      </div>
    );
  }

  if (isArray) {
    return (
      <section className={`${styles.guideSection} ${depthClass}`} data-depth={depth}>
        {label != null && (
          <h2 className={styles.guideHeading} data-depth={depth}>
            {String(label)}
          </h2>
        )}
        <ul className={styles.guideList}>
          {value.map((v, idx) => (
            <li key={idx} className={styles.guideListItem}>
              <RecursiveNode label={null} value={v} depth={depth + 1} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const entries = Object.entries(value || {});
  return (
    <section className={`${styles.guideSection} ${depthClass}`} data-depth={depth}>
      {label != null && (
        <h2 className={styles.guideHeading} data-depth={depth}>
          {String(label)}
        </h2>
      )}
      {entries.length === 0 ? (
        <div className={styles.guideEmpty}>(empty)</div>
      ) : (
        entries.map(([k, v]) => (
          <div key={k} className={styles.guideBranch}>
            <RecursiveNode label={k} value={v} depth={depth + 1} />
          </div>
        ))
      )}
    </section>
  );
}