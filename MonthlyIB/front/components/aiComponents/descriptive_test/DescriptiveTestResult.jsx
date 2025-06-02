"use client";

import { use, useEffect, useState } from "react";
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

  useEffect(() => {

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
    setFeedbackLoading(true);
    console.log("Generating feedback for answerId:", answerId);
    try {
      const updated = await generateFeedback(answerId, userInfo);
      console.log("Feedback generated:", updated);
      setResult(updated.data);
      setShowFeedback(true);
    } catch (err) {
      console.error("피드백 생성 실패:", err);
      alert("피드백 생성에 실패했습니다.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleMoreQuestionClick = () => {
    if (!result) return;
    const url = `/aitools/descriptive/write?subject=${encodeURIComponent(result.subject)}&chapter=${encodeURIComponent(result.chapter)}`;
    router.push(url);
  };

  if (loading) return <div>Loading...</div>;
  if (!result) return <div>결과를 불러올 수 없습니다.</div>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>AI 서술형 문제 결과</h1>

      <div className={styles.grid}>
        <div className={styles.questionSection}>
          <div className={styles.metaText}><strong>Subject:</strong> {result.subject}</div>
          <div className={styles.metaText}><strong>Chapter:</strong> {result.chapter}</div>
          <div className={styles.metaText}><strong>Max Score:</strong> {result.maxScore}</div>
          <div className={styles.metaText}><strong>문제 내용</strong></div>
          <div
            className={styles.questionText}
            dangerouslySetInnerHTML={{ __html: result.question }}
          />
          {result.imagePath && (
            <img src={result.imagePath} alt="문제 이미지" className={styles.image} />
          )}
        </div>

        <div className={styles.answerSection}>
          <div className={styles.metaText}><strong>학생 답안</strong></div>
          <p className={styles.questionText}>{result.answerText}</p>
        </div>
      </div>

      <div className={styles.feedbackButtonContainer}>
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
      </div>

      {showFeedback && (
        <div className={styles.resultContainer}>
          <div className={styles.resultRow}>
            <div className={styles.resultLabel}>점수</div>
            <div className={styles.resultContent}>{result.score ?? "채점되지 않음"}</div>
          </div>
          <div className={styles.resultRow}>
            <div className={styles.resultLabel}>학생 답안</div>
            <div className={styles.resultContent}>{result.answerText}</div>
          </div>
          <div className={styles.resultRow}>
            <div className={styles.resultLabel}>모범 답안</div>
            <div className={styles.resultContent}>{result.modelAnswer || "없음"}</div>
          </div>
          <div className={styles.resultRow}>
            <div className={styles.feedbackToggleWrapper}>
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