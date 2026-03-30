"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./ChapterTestResult.module.css";
import { getQuizResult } from "@/apis/AiChapterTestAPI";
import { useUserInfo } from "@/store/user";

const ChapterTestResult = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [result, setResult] = useState(null);
  const { userInfo } = useUserInfo();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getQuizResult(sessionId,userInfo);
        setResult(res.data);
      } catch (err) {
        console.error("결과 불러오기 실패:", err);
      }
    };

    if (sessionId) fetchResult();
  }, [sessionId]);

  if (!result) {
    return (
      <main className={styles.container}>
        <section className={styles.loadingCard}>
          <span className={styles.eyebrow}>AI Chapter Test</span>
          <h1 className={styles.heading}>결과를 불러오는 중입니다</h1>
          <p className={styles.summaryText}>채점 결과와 문제별 분석을 준비하고 있습니다.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.summaryCard}>
        <span className={styles.eyebrow}>Result Summary</span>
        <h1 className={styles.heading}>시험 결과</h1>
        <p className={styles.summaryText}>
          {result.subject} · {result.chapter}
        </p>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>총 문제 수</span>
            <strong className={styles.statValue}>{result.totalQuestions}</strong>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>정답 수</span>
            <strong className={styles.statValue}>{result.correctAnswers}</strong>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>소요 시간</span>
            <strong className={styles.statValue}>
              {Math.floor(result.totalTimeSeconds / 60)}분 {result.totalTimeSeconds % 60}초
            </strong>
          </div>
        </div>
      </section>

      <section className={styles.detailSection}>
        <h2 className={styles.subheading}>문제별 상세</h2>
        <ul className={styles.questionList}>
        {result.questionDetails.map((q, idx) => (
          <li
            key={q.questionId}
            className={`${styles.questionItem} ${q.correct ? styles.correct : styles.incorrect}`}
          >
            <div className={styles.questionRow}>
              <div className={styles.questionBox}>
                <div className={styles.questionTitle}>
                  <span dangerouslySetInnerHTML={{ __html: `${idx + 1}. ${q.question}` }} />
                </div>
              </div>
              <div className={styles.choiceBox}>
                <ul className={styles.choiceList}>
                  <li><strong>A.</strong> <span dangerouslySetInnerHTML={{ __html: q.choiceA }} /></li>
                  <li><strong>B.</strong> <span dangerouslySetInnerHTML={{ __html: q.choiceB }} /></li>
                  <li><strong>C.</strong> <span dangerouslySetInnerHTML={{ __html: q.choiceC }} /></li>
                  <li><strong>D.</strong> <span dangerouslySetInnerHTML={{ __html: q.choiceD }} /></li>
                </ul>
                <p className={styles.answer}>내 정답: <strong>{q.userAnswer}</strong> / 정답: <strong>{q.answer}</strong></p>
                <p className={styles.answer}>정답 여부: {q.correct ? "✅ 정답" : "❌ 오답"}</p>
                <p className={styles.time}>문제 푼 시간: {q.elapsedTime}초</p>
              </div>
            </div>
          </li>
        ))}
        </ul>
      </section>
    </main>
  );
};

export default ChapterTestResult;
