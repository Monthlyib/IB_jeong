"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIOStore } from "@/store/AIIostore"; // 전역 상태 (IOC 주제, 작가, 작품제목, 대본파일)
import styles from "./AIIoRecording.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

const AIIoRecording = () => {
  const router = useRouter();
  const { iocTopic, workTitle, author, scriptFile } = useIOStore();

  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10분 (600초)
  const [feedback, setFeedback] = useState("");

  // 녹음 시작
  const handleStartRecording = () => {
    // 실제 녹음 로직 (MediaRecorder 등)
    setIsRecording(true);
  };

  // 녹음 중단
  const handleStopRecording = () => {
    // 실제 녹음 중단 로직
    setIsRecording(false);
  };

  // 피드백 받기
  const handleGetFeedback = () => {
    // 음성 -> 텍스트 변환, AI 분석 로직 등
    setFeedback("AI가 분석한 피드백 내용이 표시됩니다. 문장별 개선점, 표현 방법 제안 등...");
  };

  // 튜터에게 보내기
  const handleSendToTutor = () => {
    alert("튜터에게 대본 및 녹음 내용을 전송했습니다! (실제 로직 필요)");
  };

  // 타이머 로직
  useEffect(() => {
    let timerId;
    if (isRecording && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isRecording, timeLeft]);

  // 시·분 포맷팅
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <main className={styles.container}>
      {/* 1) 인트로 섹션 */}
      <section className={styles.introSection}>
        <h1 className={styles.title}>AI IO 말하기 연습 / 녹음</h1>
        <p className={styles.description}>
          마이크 아이콘을 눌러 녹음을 시작하고, 타이머가 0이 되기 전에 녹음을 종료하세요.
        </p>
      </section>

      {/* 2) 정보영역 */}
      <section className={styles.infoSection}>
        <h2 className={styles.infoTitle}>정보</h2>
        <div className={styles.infoRow}>
          <span>IOC 주제:</span>
          <strong>{iocTopic}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>작품 제목:</span>
          <strong>{workTitle}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>작가:</span>
          <strong>{author}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>대본 파일:</span>
          <strong>{scriptFile?.name}</strong>
        </div>
      </section>

      {/* 3) 녹음 인터페이스 */}
      <section className={styles.recordSection}>
        {/* 타이머 표시 */}
        <div className={styles.timer}>{formatTime(timeLeft)}</div>

        {/* 녹음 버튼 (시작/중단) */}
        {!isRecording ? (
          <button className={styles.recordButton} onClick={handleStartRecording}>
            <FontAwesomeIcon icon={faMicrophone} className={styles.icon} />
            녹음 시작
          </button>
        ) : (
          <button className={styles.stopButton} onClick={handleStopRecording}>
            녹음 중단
          </button>
        )}

        {/* 피드백 받기 버튼 */}
        <button className={styles.feedbackButton} onClick={handleGetFeedback}>
          피드백 받기
        </button>
      </section>

      {/* 4) 피드백 섹션 */}
      {feedback && (
        <section className={styles.feedbackSection}>
          <h2 className={styles.feedbackTitle}>피드백 요약</h2>
          <p className={styles.feedbackContent}>{feedback}</p>

          {/* 튜터에게 보내기 버튼 */}
          <button className={styles.tutorButton} onClick={handleSendToTutor}>
            튜터에게 보내고 레슨 잡기
          </button>
        </section>
      )}
    </main>
  );
};

export default AIIoRecording;