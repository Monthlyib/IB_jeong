"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AIEssay.module.css";

const AIEssay = () => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");

  const handleLoadProblem = () => {
    if (!subject || !chapter) {
      alert("과목과 챕터를 모두 선택하세요.");
      return;
    }
    // 실제 문제 불러오기 로직 or 이동할 경로 지정
    router.push(`/aitools/essay/problem?subject=${subject}&chapter=${chapter}`);
  };

  return (
    <main className={styles.container}>
      {/* 상단 영역: 제목 + 간단 소개 문구 */}
      <section className={styles.introSection}>
        <h1 className={styles.title}>AI 서술형 평가</h1>
        <p className={styles.description}>
          과목과 챕터를 선택하고 서술형 문제에 답변하세요!
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
            <option value="English A">English A</option>
            <option value="Korean A">Korean A</option>
            <option value="Econ">Economics</option>
            <option value="Business">Business</option>
            <option value="Psychology">Psychology</option>
            <option value="Geography">Geography</option>
            <option value="History">History</option>
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
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
            {/* 실제로는 과목에 따라 챕터 목록이 달라질 수 있음 */}
            <option value="Topic1">Topic 1</option>
            <option value="Topic2">Topic 2</option>
            <option value="Topic3">Topic 3</option>
          </select>
        </div>

        <button className={styles.loadButton} onClick={handleLoadProblem}>
          문제 불러오기
        </button>
      </section>
    </main>
  );
};

export default AIEssay;