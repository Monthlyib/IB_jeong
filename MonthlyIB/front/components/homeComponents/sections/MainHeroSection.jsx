import Link from "next/link";
import styles from "../Main.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import MainSwiper from "../MainSwiper";

const HERO_PREVIEW_CARDS = [
  { href: "/course", top: "LESSON", mid: "L", bottom: "영상강의" },
  { href: "/board/download", top: "STUDY", mid: "S", bottom: "Study Material" },
  { href: "/tutoring", top: "TUTORING", mid: "T", bottom: "튜터링 예약" },
];

const MainHeroSection = ({ previewMode = false }) => {
  return (
    <section className={styles.main_wrap}>
      <div className={styles.left_cont}>
        <span>IB 45 PROJECT</span>
        <h2>학습콘텐츠</h2>
        <p>
          각 과목 IB전문가들이 철저한 검증을 거친 <br />
          월간 IB만의 최고의 학습 콘텐츠를 만나보세요
        </p>
        <div className={styles.controller}>
          <button type="button" className="top_left_btn">
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button type="button" className="top_right_btn">
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
      <div className={styles.right_cont}>
        <div className={styles.main_project_swiper}>
          {previewMode ? (
            <div className={styles.previewSwiperTrack}>
              {HERO_PREVIEW_CARDS.map((card) => (
                <Link key={card.href} href={card.href} className={`${styles.previewSlide} ${styles.pr_wrap}`}>
                  <div className={styles.pr_top}>{card.top}</div>
                  <div className={styles.pr_md}>{card.mid}</div>
                  <div className={styles.pr_bt}>{card.bottom}</div>
                  <div className={styles.pr_dim}></div>
                </Link>
              ))}
            </div>
          ) : (
            <MainSwiper />
          )}
        </div>
      </div>
    </section>
  );
};

export default MainHeroSection;
