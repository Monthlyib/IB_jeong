"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./descriptive_test_write.module.css";

const DescriptiveTestWrite = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const chapter = searchParams.get("chapter");

  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(
          `/api/descriptive-question?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`
        );
        const data = await res.json();
        setQuestionData(data);
      } catch (error) {
        console.error("문제 불러오기 실패:", error);
      }
    };

    if (subject && chapter) {
      fetchQuestion();
    }
  }, [subject, chapter]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("답안을 입력해주세요.");
      return;
    }

    try {
      await fetch("/api/submit-descriptive-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          chapter,
          questionId: questionData?.id,
          answer,
        }),
      });
      alert("답안이 제출되었습니다!");
    } catch (error) {
      console.error("답안 제출 실패:", error);
      alert("답안 제출에 실패했습니다.");
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>3.1 AI 서술형 문제 &amp; 답안 입력</h1>
      <div className={styles.grid}>
        <div className={styles.questionSection}>
          <h3>서술형 문제 및 이미지</h3>
          {questionData?.imagePath && (
            <img
              src={questionData.imagePath}
              alt="문제 이미지"
              className={styles.image}
            />
          )}
          <p dangerouslySetInnerHTML={{ __html: questionData?.question || "문제를 불러오는 중입니다..." }} />
        </div>
        <div className={styles.answerSection}>
          <h3>[Text Editor 답안작성]</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="여기에 답안을 작성하세요..."
            className={styles.textarea}
          />
          <button onClick={handleSubmit} className={styles.submitButton}>
            답안 제출
          </button>
        </div>
      </div>
    </main>
  );
};

export default DescriptiveTestWrite;