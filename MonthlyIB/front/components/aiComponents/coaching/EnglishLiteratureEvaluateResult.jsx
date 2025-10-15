// components/aiComponents/coaching/EnglishLiteratureEvaluateResult.jsx
// Literature Evaluate 전용 컴포넌트 (고정 스키마에 맞춤)

import React from "react";
import styles from "./EnglishGeneratedGuide.module.css";

/**
 * Literature Evaluate 응답 전용 뷰 (고정 스키마)
 * 입력 예시(백엔드 고정):
 * {
 *   "response_mode": "evaluative_feedback",
 *   "student_question": "...",
 *   "evaluation_intro": "...",
 *   "building_steps": [{ step_number, title, instruction, example }, ...],
 *   "identified_limitations": [{ issue, explanation }, ...],
 *   "suggested_revisions": [{ question, ib_core_concept, description, essay_guideline }, ...],
 *   "core_concepts_with_questions": [{ concept, guiding_questions: [] }, ...],
 *   "meta": { subject, mode, textType }
 * }
 */
export default function EnglishLiteratureEvaluateResult({ data, onReset, onCreateDraft }) {
  if (!data) return null;

  const {
    student_question,
    evaluation_intro,
    building_steps = [],
    identified_limitations = [],
    suggested_revisions = [],
    core_concepts_with_questions = [],
  } = data;

  return (
    <div className={styles["guide-container"]}>
      <div className={styles["guide-body"]}>
        {/* Student Question */}
        {student_question && (
          <section className={styles["section"]}>
            <h2 className={styles["section-title"]}>Student Question</h2>
            <div className={styles["pill"]}>{student_question}</div>
          </section>
        )}

        {/* Evaluation Intro */}
        {evaluation_intro && (
          <section className={styles["section"]}>
            <h2 className={styles["section-title"]}>Evaluation</h2>
            <div className={styles["card"]}>
              <p className={styles["paragraph"]}>{evaluation_intro}</p>
            </div>
          </section>
        )}

        {/* Building Steps */}
        {Array.isArray(building_steps) && building_steps.length > 0 && (
          <section className={styles["section"]}>
            <h2 className={styles["section-title"]}>Building Steps</h2>
            <div className={styles["steps-list"]}>
              {building_steps.map((step, idx) => (
                <div key={idx} className={styles["step-card"]}>
                  <div className={styles["step-head"]}>
                    <span className={styles["step-badge"]}>{step.step_number}</span>
                    <h3 className={styles["step-title"]}>{step.title}</h3>
                  </div>
                  <div className={styles["step-body"]}>
                    <div className={styles["step-row"]}>
                      <div className={styles["step-key"]}>Instruction</div>
                      <div className={styles["step-val"]}>{step.instruction}</div>
                    </div>
                    <div className={styles["step-row"]}>
                      <div className={styles["step-key"]}>Example</div>
                      <div className={styles["step-val"]}>{step.example}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Identified Limitations */}
        {Array.isArray(identified_limitations) && identified_limitations.length > 0 && (
          <section className={styles["section"]}>
            <h2 className={styles["section-title"]}>Identified Limitations</h2>
            <div className={styles["topics-list"]}>
              {identified_limitations.map((item, idx) => (
                <div key={idx} className={styles["topic-card"]}>
                  <div className={styles["topic-body"]}>
                    {item.issue && (
                      <div className={styles["topic-row"]}>
                        <div className={styles["topic-key"]}>Issue</div>
                        <div className={styles["topic-val"]}>{item.issue}</div>
                      </div>
                    )}
                    {item.explanation && (
                      <div className={styles["topic-row"]}>
                        <div className={styles["topic-key"]}>Explanation</div>
                        <div className={styles["topic-val"]}>{item.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Suggested Revisions */}
        {Array.isArray(suggested_revisions) && suggested_revisions.length > 0 && (
          <section className={styles["section"]}>
            <h2 className={styles["section-title"]}>Suggested Revisions</h2>
            <div className={styles["topics-list"]}>
              {suggested_revisions.map((topic, idx) => (
                <div key={idx} className={styles["topic-card"]}>
                  <div className={styles["topic-head"]}>
                    <h3 className={styles["topic-question"]}>{topic.question}</h3>
                    {topic.ib_core_concept && (
                      <span className={styles["concept-chip"]}>{topic.ib_core_concept}</span>
                    )}
                  </div>
                  <div className={styles["topic-body"]}>
                    {topic.description && (
                      <div className={styles["topic-row"]}>
                        <div className={styles["topic-key"]}>Description</div>
                        <div className={styles["topic-val"]}>{topic.description}</div>
                      </div>
                    )}
                    {topic.essay_guideline && (
                      <div className={styles["topic-row"]}>
                        <div className={styles["topic-key"]}>Essay Guideline</div>
                        <div className={styles["topic-val"]}>{topic.essay_guideline}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Concepts — Guiding Questions */}
        {Array.isArray(core_concepts_with_questions) && core_concepts_with_questions.length > 0 && (
          <section className={styles["section"]}>
            <h2 className={styles["section-title"]}>Core Concepts — Guiding Questions</h2>
            <div className={styles["concepts-grid"]}>
              {core_concepts_with_questions.map((concept, idx) => (
                <div key={idx} className={styles["concept-card"]}>
                  <div className={styles["concept-head"]}>
                    <span className={styles["concept-chip"]}>{concept.concept}</span>
                  </div>
                  {Array.isArray(concept.guiding_questions) && concept.guiding_questions.length > 0 && (
                    <ul className={styles["concept-list"]}>
                      {concept.guiding_questions.map((q, qIdx) => (
                        <li key={qIdx} className={styles["concept-item"]}>
                          {q}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <section className={styles["section"]}>
          <div className={styles["actions"]}>
            <button
              type="button"
              className={styles["primaryBtn"]}
              onClick={onCreateDraft}
              disabled={!onCreateDraft}
              aria-label="Create a draft from evaluated literature question"
            >
              🧾 이 주제로 Draft 생성하기
            </button>

            <button
              type="button"
              className={styles["ghostBtn"]}
              onClick={onReset}
              disabled={!onReset}
              aria-label="Reset English Literature coaching flow"
            >
              🧹 초기화
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}