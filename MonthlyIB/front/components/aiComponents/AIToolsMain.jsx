"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faArrowRight,
  faChalkboardTeacher,
  faClipboardCheck,
  faClipboardList,
  faMicrophoneAlt,
  faPenNib,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AIToolsMain.module.css";

const toolCards = [
  {
    href: "/aitools/chapter-test",
    icon: faClipboardList,
    title: "AI Chapter Test",
    description: "과목과 챕터를 선택해 바로 객관식 테스트를 생성하고 실전처럼 풀어봅니다.",
    badge: "Practice",
    meta: "빠른 진단",
  },
  {
    href: "/aitools/descriptive",
    icon: faAlignLeft,
    title: "AI 서술형 평가",
    description: "서술형 답안을 작성하고 문장력, 논리, 핵심 개념 반영 여부를 점검합니다.",
    badge: "Feedback",
    meta: "답안 분석",
  },
  {
    href: "/aitools/coaching",
    icon: faChalkboardTeacher,
    title: "AI IA/EE 코칭",
    description: "IA와 EE 주제 탐색부터 구조화, 초안 방향 설정까지 단계별로 도와줍니다.",
    badge: "Coaching",
    meta: "주제 설계",
  },
  {
    href: "/aitools/io-practice",
    icon: faMicrophoneAlt,
    title: "AI IO 연습",
    description: "스크립트와 녹음을 바탕으로 말하기 흐름과 전달력을 연습하고 피드백을 받습니다.",
    badge: "Speaking",
    meta: "실전 리허설",
  },
  {
    href: "/aitools/essay",
    icon: faPenNib,
    title: "AI Essay",
    description: "에세이 구조를 빠르게 잡고 핵심 논점과 전개 흐름을 정리하는 데 활용합니다.",
    badge: "Writing",
    meta: "구조 설계",
  },
];

const highlights = [
  "주제 선택부터 답안 피드백까지 한 흐름으로 연결",
  "IB 과목별 학습에 맞춘 실전형 연습",
  "빠른 진단과 반복 연습에 최적화된 도구 구성",
];

const AIToolsMain = () => {
  return (
    <main className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Monthly IB AI Suite</span>
          <h1 className={styles.heroTitle}>
            IB 학습을 더 빠르고 선명하게 만드는
            <br />
            AI 학습 도구 모음
          </h1>
          <p className={styles.heroDescription}>
            문제 풀이, 서술형 피드백, IA/EE 코칭, IO 연습까지 한 곳에서 이어서 학습할 수 있는
            AI 도구 허브입니다.
          </p>
          <div className={styles.heroActions}>
            <Link href="/aitools/chapter-test" className={styles.primaryButton}>
              가장 빠른 테스트 시작
            </Link>
            <Link href="/aitools/coaching" className={styles.secondaryButton}>
              IA/EE 코칭 보기
            </Link>
          </div>
        </div>

        <div className={styles.heroPanel}>
          <div className={styles.heroPanelHeader}>
            <span className={styles.heroPanelBadge}>추천 학습 흐름</span>
            <strong className={styles.heroPanelTitle}>진단 → 피드백 → 심화 코칭</strong>
          </div>

          <div className={styles.flowList}>
            <div className={styles.flowItem}>
              <div className={styles.flowIcon}>
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <div>
                <strong className={styles.flowTitle}>1. 빠른 실력 점검</strong>
                <p className={styles.flowText}>Chapter Test로 현재 이해도를 짧게 확인합니다.</p>
              </div>
            </div>

            <div className={styles.flowItem}>
              <div className={styles.flowIcon}>
                <FontAwesomeIcon icon={faAlignLeft} />
              </div>
              <div>
                <strong className={styles.flowTitle}>2. 답안 보완</strong>
                <p className={styles.flowText}>서술형 평가와 IO 연습으로 표현력과 논리 전개를 다듬습니다.</p>
              </div>
            </div>

            <div className={styles.flowItem}>
              <div className={styles.flowIcon}>
                <FontAwesomeIcon icon={faChalkboardTeacher} />
              </div>
              <div>
                <strong className={styles.flowTitle}>3. 장기 과제 설계</strong>
                <p className={styles.flowText}>IA/EE 코칭에서 주제와 구조를 구체화합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.highlightSection}>
        {highlights.map((item) => (
          <div key={item} className={styles.highlightCard}>
            {item}
          </div>
        ))}
      </section>

      <section className={styles.toolSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Available Tools</span>
          <h2 className={styles.sectionTitle}>지금 바로 사용할 수 있는 AI 도구</h2>
        </div>

        <div className={styles.cardGrid}>
          {toolCards.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.toolCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.cardBadge}>{tool.badge}</span>
                <span className={styles.cardMeta}>{tool.meta}</span>
              </div>

              <div className={styles.cardIcon}>
                <FontAwesomeIcon icon={tool.icon} />
              </div>

              <h3 className={styles.cardTitle}>{tool.title}</h3>
              <p className={styles.cardDescription}>{tool.description}</p>

              <div className={styles.cardArrow}>
                <span>도구 열기</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AIToolsMain;
