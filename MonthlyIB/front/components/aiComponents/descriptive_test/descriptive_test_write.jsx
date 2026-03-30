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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const answerLength = answer.trim().length;
  const answerWordCount = answer
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const data = await getDescriptiveQuestion(subject, chapter,userInfo);
        setQuestionData(data);
        console.log("불러온 문제 데이터:", data);
      } catch (error) {
        console.error("문제 불러오기 실패:", error);
      } finally {
        setLoading(false);
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
      setSubmitting(true);
      const response = await submitDescriptiveAnswer({
        subject,
        chapter,
        questionId: questionData?.id,
        answer,
      }, userInfo);
      const answerId = response?.data?.answerId ?? response?.data?.id;
      if (!answerId) {
        throw new Error("제출된 답안 ID를 확인할 수 없습니다.");
      }
      alert("답안이 제출되었습니다!");
      console.log("제출된 답안 ID:", answerId);
      router.push(`/aitools/descriptive/result/${answerId}`);
    } catch (error) {
      console.error("답안 제출 실패:", error);
      alert("답안 제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.heroCard}>
        <div className={styles.heroTopRow}>
          <div>
            <p className={styles.eyebrow}>AI DESCRIPTIVE WRITING LAB</p>
            <h1 className={styles.title}>서술형 문제 풀이 및 답안 작성</h1>
            <p className={styles.subtitle}>
              문제를 읽고, 논리적인 구조로 답안을 정리한 뒤 바로 제출해 채점과 피드백을 받을 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => router.push("/aitools/descriptive/list")}
          >
            문제 목록 보기
          </button>
        </div>

        <div className={styles.metaGrid}>
          <article className={styles.metaCard}>
            <span className={styles.metaLabel}>Subject</span>
            <strong className={styles.metaValue}>{questionData?.subject || subject || "-"}</strong>
          </article>
          <article className={styles.metaCard}>
            <span className={styles.metaLabel}>Chapter</span>
            <strong className={styles.metaValue}>{questionData?.chapter || chapter || "-"}</strong>
          </article>
          <article className={styles.metaCard}>
            <span className={styles.metaLabel}>Max Score</span>
            <strong className={styles.metaValue}>
              {questionData?.maxScore ? `${questionData.maxScore} points` : "-"}
            </strong>
          </article>
        </div>
      </section>

      <section className={styles.guideCard}>
        <div className={styles.guideHeader}>
          <div>
            <h2 className={styles.sectionTitle}>답안 작성 가이드</h2>
            <p className={styles.sectionDescription}>
              질문에서 요구하는 핵심 개념, 근거, 결론이 모두 들어가도록 답안을 설계하세요.
            </p>
          </div>
        </div>
        <div className={styles.guideList}>
          <div className={styles.guideItem}>핵심 용어를 먼저 정의하고 질문의 범위를 벗어나지 않도록 정리하기</div>
          <div className={styles.guideItem}>각 주장마다 근거 또는 예시를 붙여 채점 포인트를 명확히 드러내기</div>
          <div className={styles.guideItem}>마지막 문장에서 질문에 대한 직접적인 결론을 한 번 더 정리하기</div>
        </div>
      </section>

      <div className={styles.grid}>
        <section className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Question Sheet</p>
              <h2 className={styles.cardTitle}>서술형 문제</h2>
            </div>
            {loading && <span className={styles.loadingChip}>불러오는 중</span>}
          </div>

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
        </section>

        <section className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Answer Draft</p>
              <h2 className={styles.cardTitle}>답안 작성</h2>
            </div>
            <div className={styles.answerStats}>
              <span>{answerLength} chars</span>
              <span>{answerWordCount} words</span>
            </div>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="질문에서 요구하는 개념, 근거, 결론이 드러나도록 문단 형태로 작성해보세요."
            className={styles.textarea}
          />

          <div className={styles.answerFooter}>
            <p className={styles.helperText}>
              답안을 제출하면 결과 페이지에서 점수와 AI 피드백을 확인할 수 있습니다.
            </p>
            <button
              onClick={handleSubmit}
              className={styles.submitButton}
              disabled={submitting || loading || !questionData}
            >
              {submitting ? "제출 중..." : "답안 제출"}
            </button>
          </div>
        </section>
      </div>

      <section className={styles.noteCard}>
        <h3 className={styles.noteTitle}>작성 팁</h3>
        <div className={styles.noteBody}>
          <p>도입에서 문제의 핵심 개념을 짚고, 본문에서 근거를 전개한 뒤, 마지막에 질문에 대한 판단을 분명히 적는 구성이 가장 안정적입니다.</p>
        </div>
      </section>
    </main>
  );
};

export default DescriptiveTestWrite;
