"use client";

import Link from "next/link";
import styles from "./AICoaching.module.css";

const AICoaching = () => {
    return (
        <main className={styles.container}>
            {/* 상단 영역: 제목 + 간단 소개 문구 */}
            <section className={styles.introSection}>
                <h1 className={styles.title}>AI IA/EE 코칭</h1>
                <p className={styles.description}>
                    IA/EE 과목과 주제를 선정하고 아웃라인을 함께 짜보세요!
                </p>
            </section>

            {/* IA / EE 카드 영역 */}
            <section className={styles.cardContainer}>
                {/* IA 카드 */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Internal Assessment</h2>
                    <p className={styles.cardDesc}>
                        IA 과목과 토픽을 입력하고 무료로 무제한 코칭 받기
                    </p>
                    {/* 예: IA 상세 페이지로 이동 */}
                    <Link href="/aitools/essay/ia" className={styles.cardButton}>
                        시작하기
                    </Link>
                </div>

                {/* EE 카드 */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Extended Essay</h2>
                    <p className={styles.cardDesc}>
                        주제 선정 & 아웃라인 작성
                    </p>
                    {/* 예: EE 상세 페이지로 이동 */}
                    <Link href="/aitools/essay/ee" className={styles.cardButton}>
                        시작하기
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default AICoaching;