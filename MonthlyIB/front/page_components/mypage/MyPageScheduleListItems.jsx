import styles from "./MyPage.module.css";
import _ from "lodash";

const MyPageScheduleListItems = ({ scheduleContents }) => {

    return (
        <>
            {
                scheduleContents.length > 0 ?
                    scheduleContents.map((content) => (
                        <div className={`${styles.schedule_item} 
                        ${content.status === "예약" ?
                                styles.reserve :
                                content.status === "완료" ?
                                    styles.complete :
                                    styles.cancel}`} key={content.id}>

                            <div className={styles.schedule_item_left}>
                                <b className={styles.schedule_date}>{content.Date.substr(5, 6)}</b>
                                <span className={styles.schedule_time}>
                                    {
                                        Number(content.Date.split(" ")[1].substr(0, 2)) < 12
                                            ? "오전 " + content.Date.split(" ")[1]
                                            : "오후 " + content.Date.split(" ")[1]

                                    }
                                </span>
                            </div>
                            <div className={styles.schedule_item_right}>
                                <div className={styles.schedule_content}>
                                    <span className={styles.sc_ceiling}>{content.status}</span>
                                    <p className={styles.sc_content}>{content.content}</p>
                                </div>
                                {
                                    content.status === "예약"
                                    && <a href="#" className={styles.schedule_cancel}>예약취소</a>

                                }
                            </div>

                        </div>
                    ))
                    : <div className={styles.schedule_no}>
                        <p>스케쥴이 없습니다.</p>
                    </div>
            }
        </>
    );
};

export default MyPageScheduleListItems;