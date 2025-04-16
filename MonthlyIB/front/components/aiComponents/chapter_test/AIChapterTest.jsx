"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AIChapterTest.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserInfo } from "@/store/user";
import Link from "next/link";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { getActiveQuizSession } from "@/apis/AiChapterTestAPI";
import { useChapterTestStore } from "@/store/chaptertest";

const AIChapterTest = () => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const { userInfo } = useUserInfo();
  const [pendingSessionId, setPendingSessionId] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const { fetchAndSetQuizSession } = useChapterTestStore();

  const handleStartTest = async () => {
    if (!subject || !chapter) {
      alert("과목과 챕터를 모두 선택하세요.");
      return;
    }

    try {
      const result = await getActiveQuizSession({ subject, chapter }, userInfo);
      console.log("result", result);
      if (result?.data?.quizSessionId) {
        setPendingSessionId(result.data.quizSessionId);
        setShowResumeModal(true);
      } else {
        const sessionData = await fetchAndSetQuizSession(
          { subject, chapter, questionCount, durationMinutes },
          userInfo
        );
        router.push(`/aitools/chapter-test/exam?sessionId=${sessionData.quizSessionId}`);
      }
    } catch (err) {
      console.error("시험 시작 실패:", err?.response?.data?.code);  
      if (err?.response?.data?.code === 14034) {
        alert("문제 수가 부족하여 시험을 시작할 수 없습니다.");
      } else {
        console.error("시험 시작 실패:", err);
        alert("시험 세션을 시작할 수 없습니다.");
      }
    }
  };

  const handleContinueTest = () => {
    router.push(`/aitools/chapter-test/exam?sessionId=${pendingSessionId}`);
  };

  const handleForceNewTest = async () => {
    const confirmed = confirm("이전에 완료되지 않은 시험 기록이 삭제됩니다. 새로 시작하시겠습니까?");
    if (!confirmed) return;

    try {
      const sessionData = await fetchAndSetQuizSession(
        { subject, chapter, questionCount, durationMinutes },
        userInfo
      );
      router.push(`/aitools/chapter-test/exam?sessionId=${sessionData.quizSessionId}`);
    } catch (err) {
      console.error("시험 세션 새로 시작 실패:", err);
      alert("시험 세션을 새로 시작할 수 없습니다.");
    }
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
      {userInfo?.authority === "ADMIN" && (
        <div className={styles.right_btn}>
          <Link
            href={`/aitools/chapter-test/admin-input`}
            className={styles.btn_write}
          >
            <FontAwesomeIcon icon={faPenAlt} />
            <span>문제 입력</span>
          </Link>
        </div>
      )}
      {userInfo?.authority === "ADMIN" && (
        <div className={styles.right_btn}>
          <Link
            href={`/aitools/chapter-test/list`}
            className={styles.btn_write}
          >
            <FontAwesomeIcon icon={faPenAlt} />
            <span>문제 목록 보기</span>
          </Link>
        </div>
      )}
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

        <div className={styles.selectWrapper}>
          <label htmlFor="questionCount">문제 개수 선택</label>
          <select
            id="questionCount"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className={styles.input}
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}문제
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <label htmlFor="durationMinutes">시험 시간 선택</label>
          <select
            id="durationMinutes"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
            className={styles.input}
          >
            {[10, 15, 20, 25, 30].map((min) => (
              <option key={min} value={min}>
                {min}분
              </option>
            ))}
          </select>
        </div>

        <button className={styles.startButton} onClick={handleStartTest}>
          테스트 시작
        </button>

        {pendingSessionId && showResumeModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <p>진행 중인 시험이 있습니다. 어떻게 하시겠습니까?</p>
              <div className={styles.modalButtons}>
                <button className={styles.continueButton} onClick={handleContinueTest}>
                  시험 이어보기
                </button>
                <button className={styles.resetButton} onClick={handleForceNewTest}>
                  시험 새로보기
                </button>
                <button className={styles.cancelButton} onClick={() => setShowResumeModal(false)}>
                  취소
                </button>
              </div>
              <p className={styles.notice}>※ 새로 시작하면 이전 시험 기록은 삭제됩니다.</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default AIChapterTest;