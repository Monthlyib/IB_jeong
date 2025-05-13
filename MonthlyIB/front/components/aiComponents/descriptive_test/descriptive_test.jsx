"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./descriptive_test.module.css";
import { chapterOptions } from "../chapterOptions";

const DescriptiveTestMain = () => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");

  const handleStart = () => {
    if (!subject || !chapter) {
      alert("과목과 챕터를 모두 선택하세요.");
      return;
    }
    router.push(
      `/aitools/descriptive-test/write?subject=${encodeURIComponent(
        subject
      )}&chapter=${encodeURIComponent(chapter)}`
    );
  };

  return (
    <main className={styles.container}>
      <section className={styles.intro}>
        <h1 className={styles.title}>AI 서술형 평가</h1>
        <p className={styles.subtitle}>
          과목과 챕터를 선택하고 &lsquo;문제&nbsp;불러오기&rsquo; 버튼을 눌러 보세요!
        </p>
      </section>

      <section className={styles.formSection}>
        <div className={styles.selectWrapper}>
          <label htmlFor="subjectSelect">과목 선택</label>
          <select
            id="subjectSelect"
            value={subject}
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

        <div className={styles.selectWrapper}>
          <label htmlFor="chapterSelect">챕터/토픽 선택</label>
          <select
            id="chapterSelect"
            value={chapter}
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

        <button className={styles.startButton} onClick={handleStart}>
          문제 불러오기
        </button>
      </section>
    </main>
  );
};

export default DescriptiveTestMain;