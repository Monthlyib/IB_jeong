import styles from "./MyPage.module.css";
import Paginatation from "@/components/layoutComponents/Paginatation";
import _ from "lodash";
import { useEffect } from "react";

const MyPageScheduleListItems = ({
  scheduleContents,
  currentPage,
  onPageChange,
  onCancelSchedule,
  userInfo
}) => {
  
  useEffect(()=> {
    console.log(currentPage)
    console.log(paginatedPage)
  },[]);

  const numShowContents = 10;
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(scheduleContents, currentPage);

  const handleCancel = (tutoringId,status) => {
    if (status !== "WAIT") {
      alert("취소할 수 없는 상태입니다.");
      return;
    }
    const isConfirmed = confirm("정말로 예약을 취소하시겠습니까?");
    if (isConfirmed) {
      onCancelSchedule(tutoringId,userInfo, currentPage-1); // 예약 취소 핸들러 호출
    }
  };

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

              <button
                type="button"
                className={styles.schedule_cancel}
                onClick={() => handleCancel(content.tutoringId, content.tutoringStatus)}
              >
                예약취소
              </button>
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
