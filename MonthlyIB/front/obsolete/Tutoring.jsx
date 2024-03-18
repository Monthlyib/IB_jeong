import Link from "next/link";
import styles from "./AppLayout.module.css";
import { RightOutlined } from "@ant-design/icons";

const Tutoring = () => {
    return (
        <>
            <Link href="#">튜터링 예약</Link>
            <ul className={styles.gnb2}>
                <li>
                    <Link href="#"><span>튜터링 예약</span>
                        <RightOutlined className={styles.icon} />
                    </Link>
                </li>
                <li>
                    <Link href="#"><span>질문하기</span>
                        <RightOutlined className={styles.icon} />
                    </Link>
                </li>
            </ul>
        </>
    );
};

export default Tutoring;