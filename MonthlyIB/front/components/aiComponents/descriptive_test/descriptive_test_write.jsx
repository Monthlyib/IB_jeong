"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./descriptive_test_write.module.css";
import { getDescriptiveQuestion, submitDescriptiveAnswer } from "@/apis/AiDescriptiveTestAPI";
import { useUserInfo } from "@/store/user";
const DescriptiveTestWrite = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const chapter = searchParams.get("chapter");
  const { userInfo } = useUserInfo();

  const router = useRouter();

  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await getDescriptiveQuestion(subject, chapter,userInfo);
        setQuestionData(data);
        console.log("불러온 문제 데이터:", data);
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
      const response = await submitDescriptiveAnswer({
        subject,
        chapter,
        questionId: questionData?.id,
        answer,
      }, userInfo);
      const answerId = response.data.answerId;
      alert("답안이 제출되었습니다!");
      console.log("제출된 답안 ID:", answerId);
      router.push(`/aitools/descriptive/result/${answerId}`);
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
          <h1>서술형 문제 및 이미지</h1>
          <div className={styles.metaText}><strong>Subject:</strong> {questionData?.subject}</div>
          <div className={styles.metaText}><strong>Chapter:</strong> {questionData?.chapter}</div>
          <div className={styles.metaText}><strong>Score:</strong> {questionData?.maxScore}</div>
          {questionData?.imagePath && (
            <img
              src={questionData.imagePath}
              alt="문제 이미지"
              className={styles.image}
            />
          )}
          <div
            className={styles.questionText}
            dangerouslySetInnerHTML={{ __html: questionData?.question || "문제를 불러오는 중입니다..." }}
          />
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