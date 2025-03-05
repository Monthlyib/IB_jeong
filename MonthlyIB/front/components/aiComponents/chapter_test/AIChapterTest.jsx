"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AIChapterTest.module.css";

const AIChapterTest = () => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");

  const handleStartTest = () => {
    // 예시: 실제 테스트 페이지로 이동
    // 선택한 subject, chapter 값을 쿼리 파라미터로 넘길 수도 있음
    if (!subject || !chapter) {
      alert("과목과 챕터를 모두 선택하세요.");
      return;
    }
    router.push(`/aitools/chapter-test/exam?subject=${subject}&chapter=${chapter}`);
  };

  return (
    <main className={styles.container}>
      {/* 상단 영역: 제목 + 간단 소개 문구 */}
      <section className={styles.introSection}>
        <h1 className={styles.title}>AI Chapter Test</h1>
        <p className={styles.description}>
          과목과 챕터를 선택하고 테스트를 시작해 보세요!
        </p>
      </section>

      {/* 드롭다운 + 버튼 영역 */}
      <section className={styles.formSection}>
        <div className={styles.selectWrapper}>
          <label htmlFor="subjectSelect">과목 선택</label>
          <select
            id="subjectSelect"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">과목을 선택하세요</option>
            <option value="Econ">Economics</option>
            <option value="English">English</option>
            <option value="Business">Business</option>
            <option value="Psychology">Psychology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Physics">Physics</option>
            <option value="MathAA">Math AA</option>
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
            {/* 실제로는 과목에 따라 동적으로 챕터 목록을 변경할 수도 있음 */}
            <option value="Chapter1">Chapter 1</option>
            <option value="Chapter2">Chapter 2</option>
            <option value="Chapter3">Chapter 3</option>
          </select>
        </div>

        <button className={styles.startButton} onClick={handleStartTest}>
          테스트 시작
        </button>
      </section>
    </main>
  );
};

export default AIChapterTest;