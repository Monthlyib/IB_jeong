import styles from "./Main.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleRight,
    faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import MainSwiper from "./MainSwiper";

const MainTop = () => {
    return (
        <>
            <section className={styles.main_wrap}>
                <div className={styles.left_cont}>
                    <span>IB 45 PROJECT</span>
                    <h2>학습콘텐츠</h2>
                    <p>각 과목 IB전문가들이 철저한 검증을 거친 <br />
                        월간 IB만의 최고의 학습 콘텐츠를 만나보세요
                    </p>
                    <div className={styles.controller}>
                        <button type="button" className="top_left_btn" >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>
                        <button type="button" className="top_right_btn">
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                    </div>
                </div>
                <div className={styles.right_cont}>
                    <div className={styles.main_project_swiper}>
                        <MainSwiper />
                    </div>
                </div>
            </section>
        </>
    );
};

export default MainTop;