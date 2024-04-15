import { useDispatch, useSelector } from "react-redux";
import styles from "../BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPenAlt, faTrashAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import shortId from "shortid";
import { useRouter } from "next/router";
import { newsActions } from "../../../reducers/news";
import { useCallback } from "react";
import Link from "next/link";

const NewsDetail = ({ pageId }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { User } = useSelector((state) => state.user);
    const { news } = useSelector((state) => state.news);
    const currentIndex = news.findIndex((e) => e.id == pageId);

    const onClickDelete = useCallback(() => {
        dispatch(newsActions.deleteNewsRequest({ pageId }));
        router.push("/board/");
    }, []);

    const onClickEdit = useCallback(() => {
        router.push(
            {
                pathname: "/board/newswrite",
                query:
                {
                    prevTitle: news[currentIndex].title,
                    prevContent: news[currentIndex].content,
                    pageId,
                }

            },
            '/board/newswrite'
        );
    }, []);
    return (
        <>
            <main className="width_content">
                <div className={styles.read_wrap}>
                    <div className={styles.read_cont}>
                        <div className={styles.read_left}>
                            <Link href="/board/" className={`${styles.read_btn} ${styles.list}`}>
                                <FontAwesomeIcon icon={faBars} />
                            </Link>
                        </div>
                        <div className={styles.read_center}>
                            <div className={styles.read_header}>
                                <h3>{news[currentIndex].title}</h3>
                                <div className={styles.read_info_label}>
                                    <span>{news[currentIndex].User.userName}</span>
                                    <b>·</b>
                                    <span>{news[currentIndex].Date}</span>
                                    <b>·</b>
                                    <span>{news[currentIndex].View}</span>
                                </div>
                            </div>

                            <div className={styles.read_content}>
                                <div className={styles.file_wrap}>
                                    <ul>
                                        {
                                            news[currentIndex].Files.length > 0
                                            && news[currentIndex].Files.map((f) => (
                                                <li key={shortId.generate()}>
                                                    <a href={f.src} download>
                                                        <FontAwesomeIcon icon={faFile} />
                                                        <span>{f.filename}</span>
                                                    </a>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>

                                <div className={styles.title}>
                                    <p><img src={news[currentIndex].Image.src} alt="잡지 이미지" /></p>
                                    <p>
                                        {news[currentIndex].content}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.read_btn_area}>
                                <button className={styles.prev}>이전</button>
                                <button className={styles.next}>다음</button>
                            </div>
                        </div>
                        <div className={styles.read_right}>
                            {
                                User.id === news[currentIndex].User.id &&
                                <div className={styles.auth_btn_cont}>
                                    <button className={`${styles.read_btn} ${styles.update}`} onClick={onClickEdit}>
                                        <FontAwesomeIcon icon={faPenAlt} />
                                    </button>
                                    <button className={`${styles.read_btn} ${styles.delete}`} onClick={onClickDelete}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default NewsDetail;