import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";
import styles from "./AppLayout.module.css"

const VideoLecture = () => {
    return (
        <>
            <Link href="/course">영상강의</Link>
            {/* <ul className={styles.gnb2}>
                <li>
                    <Link href="#"><span>Group 1</span>
                        <RightOutlined className={styles.icon} />
                    </Link>
                    <ul className={styles.gnb3}>
                        <li>
                            <Link href="#">
                                <span>English A</span>
                                <RightOutlined className={styles.icon} />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <span>Korean A</span>
                                <RightOutlined className={styles.icon} />
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link href="#"><span>Group 2</span>
                        <RightOutlined className={styles.icon} />
                    </Link>
                    <ul className={styles.gnb3}>
                        <li>
                            <Link href="#">
                                <span>English B</span>
                                <RightOutlined className={styles.icon} />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <span>Korean B</span>
                                <RightOutlined className={styles.icon} />
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link href="#"><span>Group 3</span>
                        <RightOutlined className={styles.icon} />
                    </Link>
                    <ul className={styles.gnb3}>
                        <li>
                            <Link href="#">
                                <span>English C</span>
                                <RightOutlined className={styles.icon} />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <span>Korean C</span>
                                <RightOutlined className={styles.icon} />
                            </Link>
                        </li>
                    </ul>
                </li>

            </ul> */}
        </>
    );
};

export default VideoLecture;