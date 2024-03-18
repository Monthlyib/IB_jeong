import { useSelector } from "react-redux";
import styles from "./BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPenAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const GuideDetail = ({ pageId }) => {
    const { guidePosts } = useSelector((state) => state.guide);
    const currentIndex = guidePosts.findIndex((e) => e.id == Number(pageId));

    return (
        <>
            <main className="width_content">
                <div className={styles.read_wrap}>
                    <div className={styles.read_cont}>
                        <div className={styles.read_center}>
                            <div className={styles.read_header}>
                                <h3>{guidePosts[currentIndex].title}</h3>
                                <div className={styles.read_info_label}>
                                    <span>{guidePosts[currentIndex].User.name}</span>
                                    <b>·</b>
                                    <span>{guidePosts[currentIndex].Date}</span>
                                    <b>·</b>
                                    <span>{guidePosts[currentIndex].View}</span>
                                </div>
                            </div>

                            <div className={styles.read_content}>

                                <div className={styles.title}>
                                    <p><img src={guidePosts[currentIndex].Image.src} alt="잡지 이미지" /></p>
                                    <p>
                                        {guidePosts[currentIndex].content}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.read_btn_area}>
                                <a href="" className={styles.prev}>이전</a>
                                <a href="" className={styles.next}>다음</a>
                            </div>
                        </div>
                        <div className={styles.read_right}>
                            <div className={styles.auth_btn_cont}>
                                <a href="" className={`${styles.read_btn} ${styles.update}`}>
                                    <FontAwesomeIcon icon={faPenAlt} />
                                </a>
                                <a href="" className={`${styles.read_btn} ${styles.delete}`}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default GuideDetail;