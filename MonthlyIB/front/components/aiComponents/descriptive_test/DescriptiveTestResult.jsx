"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./DescriptiveTestResult.module.css";
import { getDescriptiveAnswerResult, generateFeedback } from "@/apis/AiDescriptiveTestAPI";
import { useUserInfo } from "@/store/user";

const DescriptiveTestResult = () => {
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const params = useParams();
  const answerId = params.id || params.answerId;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackLanguage, setFeedbackLanguage] = useState("korean");
  const { userInfo } = useUserInfo();
  const router = useRouter();
  const scoreDisplay =
    result?.score === null || result?.score === undefined
      ? "채점 전"
      : `${result.score}/${result.maxScore ?? "-"}점`;

  useEffect(() => {
    if (!answerId || answerId === "undefined") {
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        console.log("Fetching result for answerId:", answerId);
        const data = await getDescriptiveAnswerResult(answerId, userInfo);
        setResult(data);
      } catch (error) {
        console.error("결과 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [answerId, userInfo]);

  const handleFeedbackClick = async () => {
    if (!answerId || answerId === "undefined") {
      alert("답안 ID를 확인할 수 없습니다. 다시 제출해 주세요.");
      return;
    }
    setFeedbackLoading(true);
    console.log("Generating feedback for answerId:", answerId);
    try {
      const updated = await generateFeedback(answerId, userInfo);
      console.log("Feedback generated:", updated);
      setResult(updated.data);
      setShowFeedback(true);
    } catch (err) {
      console.error("피드백 생성 실패:", err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        "피드백 생성에 실패했습니다."
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleMoreQuestionClick = () => {
    if (!result) return;
    const url = `/aitools/descriptive/write?subject=${encodeURIComponent(result.subject)}&chapter=${encodeURIComponent(result.chapter)}`;
    router.push(url);
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <section className={styles.heroCard}>
          <p className={styles.eyebrow}>AI DESCRIPTIVE REVIEW</p>
          <h1 className={styles.title}>답안 결과를 불러오는 중입니다</h1>
          <p className={styles.subtitle}>제출한 답안과 문제 정보를 정리하고 있습니다.</p>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className={styles.container}>
        <section className={styles.heroCard}>
          <p className={styles.eyebrow}>AI DESCRIPTIVE REVIEW</p>
          <h1 className={styles.title}>결과를 불러올 수 없습니다</h1>
          <p className={styles.subtitle}>답안을 다시 제출한 뒤 결과 페이지로 이동해 주세요.</p>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => router.push("/aitools/descriptive/list")}
          >
            문제 목록으로 돌아가기
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.heroCard}>
        <div className={styles.heroTopRow}>
          <div>
            <p className={styles.eyebrow}>AI DESCRIPTIVE REVIEW</p>
            <h1 className={styles.title}>서술형 답안 결과 리포트</h1>
            <p className={styles.subtitle}>
              제출한 답안을 기준으로 문제, 답안, 점수, 피드백을 한 화면에서 정리했습니다.
            </p>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => router.push("/aitools/descriptive/list")}
          >
            문제 목록 보기
          </button>
        </div>

        <div className={styles.metaGrid}>
          <article className={styles.metaCard}>
            <span className={styles.metaLabel}>Subject</span>
            <strong className={styles.metaValue}>{result.subject}</strong>
          </article>
          <article className={styles.metaCard}>
            <span className={styles.metaLabel}>Chapter</span>
            <strong className={styles.metaValue}>{result.chapter}</strong>
          </article>
          <article className={styles.metaCard}>
            <span className={styles.metaLabel}>Current Score</span>
            <strong className={styles.metaValue}>{scoreDisplay}</strong>
          </article>
        </div>
      </section>

      <div className={styles.grid}>
        <section className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Question Review</p>
              <h2 className={styles.cardTitle}>문제 다시 보기</h2>
            </div>
            <span className={styles.scoreChip}>배점 {result.maxScore ?? "-"}점</span>
          </div>
          <div
            className={styles.questionText}
            dangerouslySetInnerHTML={{ __html: result.question }}
          />
          {result.imagePath && (
            <img src={result.imagePath} alt="문제 이미지" className={styles.image} />
          )}
        </section>

        <section className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Student Draft</p>
              <h2 className={styles.cardTitle}>제출한 답안</h2>
            </div>
          </div>
          <p className={styles.answerText}>{result.answerText}</p>
        </section>
      </div>

      <section className={styles.feedbackCard}>
        <div>
          <p className={styles.cardEyebrow}>AI Feedback</p>
          <h2 className={styles.cardTitle}>채점 및 피드백</h2>
          <p className={styles.sectionDescription}>
            아직 피드백을 생성하지 않았다면, 버튼을 눌러 모범 답안과 개선 포인트를 받아보세요.
          </p>
        </div>
        {!showFeedback && (
          <button
            className={styles.feedbackToggleButton}
            onClick={handleFeedbackClick}
            disabled={feedbackLoading}
          >
            {feedbackLoading ? (
              <>
                <div className={styles.spinner}></div>
                피드백 생성 중...
              </>
            ) : (
              "피드백 생성하기"
            )}
          </button>
        )}
      </section>

      {showFeedback && (
        <section className={styles.resultPanel}>
          <div className={styles.summaryGrid}>
            <article className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Score</span>
              <strong className={styles.summaryValue}>{scoreDisplay}</strong>
            </article>
            <article className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Answer Status</span>
              <strong className={styles.summaryValue}>
                {result.modelAnswer ? "모범 답안 비교 가능" : "모범 답안 없음"}
              </strong>
            </article>
          </div>

          <div className={styles.resultContainer}>
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>학생 답안</div>
              <div className={styles.resultContent}>{result.answerText}</div>
            </div>
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>모범 답안</div>
              <div className={styles.resultContent}>{result.modelAnswer || "없음"}</div>
            </div>
            <div className={styles.resultRow}>
              <div className={styles.feedbackHeader}>
                <div className={styles.resultLabel}>
                피드백 ({feedbackLanguage === "korean" ? "한글" : "영어"})
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={feedbackLanguage === "english"}
                    onChange={() =>
                      setFeedbackLanguage((prev) =>
                        prev === "korean" ? "english" : "korean"
                      )
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.resultContent}>
                {feedbackLanguage === "korean"
                  ? result.feedbackKorean || "없음"
                  : result.feedbackEnglish || "없음"}
              </div>
            </div>
          </div>
        </section>
      )
      }
      {showFeedback && (
        <div className={styles.moreQuestionButtonWrapper}>
          <button
            onClick={handleMoreQuestionClick}
            className={styles.moreQuestionButton}
          >
            문제 더 풀기
          </button>
        </div>
      )}
    </main >
  );
};

export default DescriptiveTestResult;
