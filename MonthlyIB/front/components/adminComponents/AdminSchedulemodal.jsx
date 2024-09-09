import { useRef } from "react";
import styles from "./AdminStyle.module.css";

const AdminScheduleModal = ({
  modal,
  setModal,
  status,
  title,
  requestUsername,
  detail,
  setDetail,
  setStatus,
  onSubmitChange,
  onSubmitDelete,
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
                <div
                  style={{
                    position: "relative",
                    textAlign: "left",
                    fontSize: "2rem",
                    marginBottom: "2rem",
                  }}
                >
                  상세내용
                </div>
                <textarea
                  style={{
                    display: "block",
                    width: "100%",
                    height: "20rem",
                    fontSize: "1.8rem",
                    marginBottom: "3rem",
                  }}
                  type="text"
                  value={detail}
                  onChange={(e) => {
                    setDetail(e.target.value);
                  }}
                />
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
