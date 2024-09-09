import styles from "./MyPage.module.css";
import Paginatation from "@/components/layoutComponents/Paginatation";
import _ from "lodash";

const MyPageScheduleListItems = ({
  scheduleContents,
  currentPage,
  onPageChange,
}) => {
  const numShowContents = 10;
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(scheduleContents, currentPage);

  return (
    <>
      {scheduleContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div
            className={`${styles.schedule_item} 
                        ${
                          content.tutoringStatus === "WAIT"
                            ? styles.reserve
                            : content.tutoringStatus === "COMPLETE"
                            ? styles.complete
                            : styles.cancel
                        }`}
            key={content.tutoringId}
          >
            <div className={styles.schedule_item_left}>
              <b className={styles.schedule_date}>
                {content.date.substr(5, 6)}
              </b>
              <span className={styles.schedule_time}>
                {Number(content.hour) < 12
                  ? "오전 " +
                    content.hour +
                    ":" +
                    (content.minute === 0
                      ? content.minute + "0"
                      : content.minute)
                  : "오후 " +
                    content.hour +
                    ":" +
                    (content.minute === 0
                      ? content.minute + "0"
                      : content.minute)}
              </span>
            </div>
            <div className={styles.schedule_item_right}>
              <div className={styles.schedule_content}>
                <span className={styles.sc_ceiling}>
                  {content.tutoringStatus}
                </span>
                <p className={styles.sc_content}>{content.detail}</p>
              </div>

              <a href="#" className={styles.schedule_cancel}>
                예약취소
              </a>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.schedule_no}>
          <p>스케쥴이 없습니다.</p>
        </div>
      )}
      {scheduleContents.length > 0 && (
        <Paginatation
          contents={scheduleContents}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default MyPageScheduleListItems;
