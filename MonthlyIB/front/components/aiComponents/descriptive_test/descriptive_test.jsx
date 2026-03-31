"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./descriptive_test.module.css";
import { chapterOptions } from "../chapterOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useUserInfo } from "@/store/user";

const DescriptiveTestMain = () => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const { userInfo } = useUserInfo();

  const handleStart = () => {
    if (!subject || !chapter) {
      alert("과목과 챕터를 모두 선택하세요.");
      return;
    }
    router.push(
      `/aitools/descriptive/write?subject=${encodeURIComponent(
        subject
      )}&chapter=${encodeURIComponent(chapter)}`
    );
  };

  return (
    <main className={styles.container}>
      <section className={styles.heroCard}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>AI Descriptive Practice</span>
          <h1 className={styles.title}>AI 서술형 평가</h1>
          <p className={styles.subtitle}>
            과목과 챕터를 선택하고, 바로 서술형 문제를 불러와 답안 작성과 피드백까지 이어서 진행하세요.
          </p>
        </div>

        {userInfo?.authority === "ADMIN" && (
          <div className={styles.adminActions}>
            <Link
              href={`/aitools/descriptive/admin-input`}
              className={styles.adminButton}
            >
              <FontAwesomeIcon icon={faPenAlt} />
              <span>문제 입력</span>
            </Link>
            <Link
              href={`/aitools/descriptive/list`}
              className={styles.adminButton}
            >
              <FontAwesomeIcon icon={faPenAlt} />
              <span>문제 목록 보기</span>
            </Link>
          </div>
        )}
      </section>

      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <div>
            <p className={styles.formEyebrow}>Choose Your Setup</p>
            <h2 className={styles.formTitle}>과목과 챕터를 선택해 문제를 시작하세요</h2>
          </div>
          <p className={styles.formNote}>
            과목을 먼저 선택하면 해당 과목의 챕터 목록이 열립니다.
          </p>
        </div>

        <div className={styles.selectionStatus}>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Selected Subject</span>
            <strong className={styles.statusValue}>{subject || "아직 선택되지 않음"}</strong>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Selected Chapter</span>
            <strong className={styles.statusValue}>{chapter || "아직 선택되지 않음"}</strong>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.selectWrapper}>
            <label htmlFor="subjectSelect">과목 선택</label>
            <div className={styles.selectField}>
              <select
                id="subjectSelect"
                value={subject}
                className={!subject ? styles.placeholderSelect : ""}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setChapter("");
                }}
              >
                <option value="">과목을 선택하세요</option>
                {Object.keys(chapterOptions).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
            <p className={styles.fieldHint}>먼저 과목을 선택하면 아래 챕터 목록이 활성화됩니다.</p>
          </div>

          <div className={styles.selectWrapper}>
            <label htmlFor="chapterSelect">챕터/토픽 선택</label>
            <div className={styles.selectField}>
              <select
                id="chapterSelect"
                value={chapter}
                disabled={!subject}
                className={!chapter ? styles.placeholderSelect : ""}
                onChange={(e) => setChapter(e.target.value)}
              >
                <option value="">챕터를 선택하세요</option>
                {chapterOptions[subject]?.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>
            <p className={styles.fieldHint}>선택한 과목 기준으로 준비된 챕터와 토픽만 표시됩니다.</p>
          </div>
        </div>

        <button className={styles.startButton} onClick={handleStart}>
          문제 불러오기
        </button>
      </section>
    </main>
  );
};

export default DescriptiveTestMain;
