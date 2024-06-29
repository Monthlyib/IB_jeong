import _ from "lodash";
import styles from "./AdminStyle.module.css";
import Paginatation from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useUserInfo } from "@/store/user";
import { useTutoringStore } from "@/store/tutoring";
import shortid from "shortid";
const AdminScheduleItems = ({
  tutoringDateList,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const [modal, setModal] = useState(false);
  const [ind, setInd] = useState();
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState("");
  const closeRef = useRef();

  const { userInfo } = useUserInfo();
  const { reviseTutoring, deleteTutoring } = useTutoringStore();

  useEffect(() => {
    setDetail(paginatedPage[ind]?.detail);
    setStatus(paginatedPage[ind]?.tutoringStatus);
  }, [ind]);

  const onSubmitChangeTutoring = () => {
    setModal(false);
    reviseTutoring(
      paginatedPage[ind]?.tutoringId,
      detail,
      status,
      userInfo,
      currentPage
    );
  };

  const onSubmitDeleteTutoring = () => {
    setModal(false);
    deleteTutoring(paginatedPage[ind]?.tutoringId, userInfo, currentPage);
  };

  const onClickEdit = (index) => {
    setModal(!modal);
    setInd(index);
  };
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(tutoringDateList, currentPage);

  return (
    <>
      {paginatedPage.map((t, i) => (
        <div key={shortid.generate()}>
          <hr />
          <div className={styles.schedule}>
            {t.requestUsername}
            <div>{t.requestUserNickName}</div>
            <span>
              {t.date} {t.hour}:{t.minute === 0 ? t.minute + "0" : t.minute}
            </span>
            <span>{t.tutoringStatus === "WAIT" ? "대기" : "확정"}</span>
            <span>
              <FontAwesomeIcon icon={faPen} onClick={() => onClickEdit(i)} />
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
          </div>
          <hr />
        </div>
      ))}
      {tutoringDateList?.length > 0 && (
        <Paginatation
          contents={tutoringDateList}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}

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
                  {paginatedPage[ind]?.requestUsername} 님의 스케쥴 요청
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
              </div>
              <div className={styles.btn_wrap}>
                <button
                  type="button"
                  className={styles.ok}
                  onClick={onSubmitChangeTutoring}
                >
                  확인
                </button>
                <button
                  type="button"
                  className={styles.delete}
                  onClick={onSubmitDeleteTutoring}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
          <div className={styles.md_dim}></div>
        </div>
      )}
    </>
  );
};

export default AdminScheduleItems;
