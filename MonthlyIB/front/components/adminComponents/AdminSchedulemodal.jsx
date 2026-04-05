import { useRef } from "react";
import styles from "./AdminStyle.module.css";

const AdminScheduleModal = ({
  modal,
  setModal,
  status,
  title,
  requestUsername,
  subject,
  setSubject,
  detail,
  setDetail,
  setStatus,
  onSubmitChange,
  onSubmitDelete,
  showMailFields = false,
}) => {
  const closeRef = useRef();
  return (
    <>
      {modal === true && (
        <div className={styles.md}>
          <div
            className={styles.md_box_flex}
            ref={closeRef}
            onClick={(e) => closeRef.current === e.target && setModal(false)}
          >
            <div
              className={styles.admin_box}
              style={{ width: "60rem", position: "relative" }}
            >
              <div className={styles.md_top}>
                <div className={styles.tit} style={{ marginBottom: "5srem" }}>
                  {requestUsername} {title}
                </div>
                {showMailFields && (
                  <div className={styles.modalField}>
                    <div className={styles.modalFieldLabel}>메일 제목</div>
                    <input
                      type="text"
                      value={subject ?? ""}
                      placeholder="메일 제목을 입력해주세요."
                      onChange={(e) => {
                        setSubject?.(e.target.value);
                      }}
                    />
                  </div>
                )}
                <div className={styles.modalField}>
                  <div className={styles.modalFieldLabel}>
                    {showMailFields ? "메일 내용" : "상세내용"}
                  </div>
                  <textarea
                    className={styles.modalTextarea}
                    value={detail}
                    onChange={(e) => {
                      setDetail(e.target.value);
                    }}
                  />
                </div>
                {setStatus !== null && (
                  <>
                    <span style={{ fontSize: "2rem", marginRight: "2rem" }}>
                      예약 상태:
                    </span>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="WAIT">대기</option>
                      <option value="CONFIRM">확정</option>
                    </select>
                  </>
                )}
              </div>
              <div className={styles.btn_wrap}>
                <button
                  type="button"
                  className={styles.ok}
                  onClick={onSubmitChange}
                >
                  확인
                </button>
                {onSubmitDelete !== null && (
                  <>
                    <button
                      type="button"
                      className={styles.delete}
                      onClick={onSubmitDelete}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.md_dim}></div>
        </div>
      )}
    </>
  );
};

export default AdminScheduleModal;
