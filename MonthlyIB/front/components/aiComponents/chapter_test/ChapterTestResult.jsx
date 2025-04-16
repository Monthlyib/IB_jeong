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

  if (!result) return <div>결과를 불러오는 중...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>시험 결과</h2>
      <p className={styles.text}>과목: {result.subject}</p>
      <p className={styles.text}>챕터: {result.chapter}</p>
      <p className={styles.text}>총 문제 수: {result.totalQuestions}</p>
      <p className={styles.text}>맞은 개수: {result.correctAnswers}</p>
      <p className={styles.text}>
        총 소요 시간: {Math.floor(result.totalTimeSeconds / 60)}분 {result.totalTimeSeconds % 60}초
      </p>

      <h3 className={styles.subheading}>문제별 상세</h3>
      <ul className={styles.questionList}>
        {result.questionDetails.map((q, idx) => (
          <li
            key={q.questionId}
            className={`${styles.questionItem} ${q.correct ? styles.correct : styles.incorrect}`}
          >
            <div className={styles.questionRow}>
              <div className={styles.questionBox}>
                <div className={`${styles.questionTitle} ${styles.questionTitle}`}>
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
    </div>
  );
};

export default ChapterTestResult;
