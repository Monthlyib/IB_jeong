"use client";

import { useEffect, useState } from "react";
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

  const { userInfo } = useUserInfo();

  const currentQuestion = quizSession?.questions?.[currentIdx];

  useEffect(() => {
    setElapsedTime(0);

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

  if (!quizSession?.questions?.length || !currentQuestion) {
    return (
      <main className={styles.container}>
        <section className={styles.loadingCard}>
          <span className={styles.eyebrow}>AI Chapter Test</span>
          <h1 className={styles.pageTitle}>시험 정보를 불러오는 중입니다</h1>
          <p className={styles.helperText}>
            세션 정보가 아직 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </section>
      </main>
    );
  }

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
    <main className={styles.container}>
      <section className={styles.headerCard}>
        <div>
          <span className={styles.eyebrow}>Live Test Session</span>
          <h1 className={styles.pageTitle}>{quizSession.subject}</h1>
          <p className={styles.helperText}>{quizSession.chapter}</p>
        </div>
        <div className={styles.timerCard}>
          <span className={styles.timerLabel}>남은 시간</span>
          <strong className={styles.timer}>{formatTime(timeLeft)}</strong>
        </div>
      </section>

      <section className={styles.progressRow}>
        <div className={styles.progressCard}>
          <span className={styles.progressLabel}>문항 진행</span>
          <strong className={styles.progressValue}>
            {currentIdx + 1} / {quizSession.questions.length}
          </strong>
        </div>
      </section>

      <section className={styles.main}>
        <div className={styles.questionArea}>
          <div className={styles.questionNumber}>Question {currentIdx + 1}</div>
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
      </section>
      <button className={styles.nextButton} onClick={handleSubmitAnswer}>
        {currentIdx === quizSession?.questions.length - 1 ? "제출하기" : "다음"}
      </button>
    </main>
  );
};

export default ChapterTestExam;
