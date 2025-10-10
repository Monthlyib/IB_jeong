

import React from "react";
import styles from "./EnglishGeneratedGuide.module.css";

export default function EnglishLanguageGenerativeResult({ data }) {
  if (!data) return null;

  const {
    interest_topic,
    intro_paragraph,
    building_steps = [],
    core_concepts_with_questions = [],
    suggested_topics = [],
  } = data;

  return (
    <div className={styles["guide-container"]}>
      <div className={styles["guide-body"]}>
        <section className={styles["section"]}>
          <h2 className={styles["section-title"]}>Interest Topic</h2>
          <div className={styles["pill"]}>{interest_topic}</div>
        </section>

        <section className={styles["section"]}>
          <h2 className={styles["section-title"]}>Introduction</h2>
          <div className={styles["card"]}>
            <p className={styles["paragraph"]}>{intro_paragraph}</p>
          </div>
        </section>

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

        <section className={styles["section"]}>
          <h2 className={styles["section-title"]}>Core Concepts — Guiding Questions</h2>
          <div className={styles["concepts-grid"]}>
            {core_concepts_with_questions.map((concept, idx) => (
              <div key={idx} className={styles["concept-card"]}>
                <div className={styles["concept-head"]}>
                  <span className={styles["concept-chip"]}>{concept.concept}</span>
                </div>
                <ul className={styles["concept-list"]}>
                  {concept.guiding_questions.map((q, qIdx) => (
                    <li key={qIdx} className={styles["concept-item"]}>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={styles["section"]}>
          <h2 className={styles["section-title"]}>Suggested Research Questions</h2>
          <div className={styles["topics-list"]}>
            {suggested_topics.map((topic, idx) => (
              <div key={idx} className={styles["topic-card"]}>
                <div className={styles["topic-head"]}>
                  <h3 className={styles["topic-question"]}>{topic.question}</h3>
                  <span className={styles["concept-chip"]}>{topic.ib_core_concept}</span>
                </div>
                <div className={styles["topic-body"]}>
                  <div className={styles["topic-row"]}>
                    <div className={styles["topic-key"]}>Description</div>
                    <div className={styles["topic-val"]}>{topic.description}</div>
                  </div>
                  <div className={styles["topic-row"]}>
                    <div className={styles["topic-key"]}>Essay Guideline</div>
                    <div className={styles["topic-val"]}>{topic.essay_guideline}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}