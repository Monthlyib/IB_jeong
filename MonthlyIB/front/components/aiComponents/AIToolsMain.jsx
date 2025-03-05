"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faAlignLeft,
  faChalkboardTeacher,
  faMicrophoneAlt,
} from "@fortawesome/free-solid-svg-icons";

const AIToolsMain = () => {
  return (
    <main>
      {/* 배너 영역 */}
      <section className="aiToolsMainBanner">
        <h1>IB 학습, 이제 AI로 더 효율적으로!</h1>
        <Link href="/aitools/chapter-test" className="startButton">
          AI 학습 도구 사용하기
        </Link> 
      </section>

      {/* AI 기능 카드 영역 */}
      <section className="aiToolsCardContainer">
        <Link href="/aitools/chapter-test" className="aiToolsCard">
          <div className="aiToolsCardIcon">
            <FontAwesomeIcon icon={faClipboardList} size="2x" />
          </div>
          <h2 className="aiToolsCardTitle">AI Chapter Test</h2>
          <p className="aiToolsCardDesc">
            과목과 챕터 선택 후 테스트 시작
          </p>
        </Link>

        <Link href="/aitools/essay" className="aiToolsCard">
          <div className="aiToolsCardIcon">
            <FontAwesomeIcon icon={faAlignLeft} size="2x" />
          </div>
          <h2 className="aiToolsCardTitle">AI 서술형 평가</h2>
          <p className="aiToolsCardDesc">
            서술형 문제로 평가 및 피드백 받기
          </p>
        </Link>

        <Link href="/aitools/coaching" className="aiToolsCard">
          <div className="aiToolsCardIcon">
            <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" />
          </div>
          <h2 className="aiToolsCardTitle">AI IA/EE 코칭</h2>
          <p className="aiToolsCardDesc">
            주제 추천 및 아웃라인 작성 지원
          </p>
        </Link>

        <Link href="/aitools/io-practice" className="aiToolsCard">
          <div className="aiToolsCardIcon">
            <FontAwesomeIcon icon={faMicrophoneAlt} size="2x" />
          </div>
          <h2 className="aiToolsCardTitle">AI IO 연습</h2>
          <p className="aiToolsCardDesc">
            말하기 연습 및 피드백 받기
          </p>
        </Link>
      </section>
    </main>
  );
};

export default AIToolsMain;