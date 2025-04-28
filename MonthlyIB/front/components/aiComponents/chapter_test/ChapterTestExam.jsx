"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useChapterTestStore } from "@/store/chaptertest";
import styles from "./ChapterTestExam.module.css";
import { submitAnswer, submitQuizSession } from "@/apis/AiChapterTestAPI";
import { useUserInfo } from "@/store/user";

const ChapterTestExam = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const { quizSession } = useChapterTestStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState("");
  const [timeLeft, setTimeLeft] = useState(quizSession?.durationMinutes * 60 || 0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const { userInfo } = useUserInfo();
  const timerRef = useRef();

  const currentQuestion = quizSession?.questions?.[currentIdx];

  useEffect(() => {
    console.log("quizSession", quizSession);
  }, []);

  useEffect(() => {
    setElapsedTime(0);
    setQuestionStartTime(Date.now());

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAll();
          return 0;
        }
        return prev - 1;
      });
      setElapsedTime((et) => et + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIdx]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSubmitAnswer = async () => {
    if (selected) {
      await submitAnswer(sessionId, currentQuestion.id, selected, elapsedTime, userInfo);
    }

    if (currentIdx < quizSession.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelected("");
    } else {
      await handleSubmitAll();
    }
  };

  const handleSubmitAll = async () => {
    try {
      await submitQuizSession(sessionId, userInfo); // userInfo is passed for authentication if needed
      router.push(`/aitools/chapter-test/result?sessionId=${sessionId}`);
    } catch (err) {
      console.error("시험 제출 실패:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.timer}>남은 시간: {formatTime(timeLeft)}</div>
      <div className={styles.main}>
        <div className={styles.questionArea}>
          <div className={styles.question} dangerouslySetInnerHTML={{ __html: currentQuestion?.question }} />
          {currentQuestion?.imagePath && (
            <div className={styles.imageContainer}>
              <img src={currentQuestion.imagePath} alt="Question Image" className={styles.questionImage} />
            </div>
          )}
        </div>
        <div className={styles.choices}>
          {["A", "B", "C", "D"].map((opt) => (
            <button
              key={opt}
              className={`${styles.choice} ${selected === opt ? styles.selected : ""}`}
              onClick={() => setSelected(opt)}
            >
              <strong>{opt}.</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: currentQuestion?.[`choice${opt}`] }} />
            </button>
          ))}
        </div>
      </div>
      <button className={styles.nextButton} onClick={handleSubmitAnswer}>
        {currentIdx === quizSession?.questions.length - 1 ? "제출하기" : "다음"}
      </button>
    </div>
  );
};

export default ChapterTestExam;
