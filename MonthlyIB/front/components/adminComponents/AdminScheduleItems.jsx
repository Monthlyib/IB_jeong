import _ from "lodash";
import styles from "./AdminStyle.module.css";
import Paginatation from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useUserInfo } from "@/store/user";
import { useTutoringStore } from "@/store/tutoring";
import shortid from "shortid";
import { mailPost } from "@/apis/mail";
import AdminScheduleModal from "./AdminSchedulemodal";

const AdminScheduleItems = ({
  tutoringDateList,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const [modal, setModal] = useState(false);
  const [mailModal, setMailModal] = useState(false);
  const [ind, setInd] = useState();
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState("");

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

  const onSubmitMail = () => {
    setMailModal(false);
    mailPost(paginatedPage[ind]?.requestUserId, detail, userInfo);
  };

  const onSubmitDeleteTutoring = () => {
    setModal(false);
    deleteTutoring(paginatedPage[ind]?.tutoringId, userInfo, currentPage);
  };

  const onClickEdit = (index) => {
    setModal(!modal);
    setInd(index);
  };

  const onClickMail = (index) => {
    setMailModal(!mailModal);
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
              <FontAwesomeIcon
                icon={faEnvelope}
                onClick={() => onClickMail(i)}
              />
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

      <AdminScheduleModal
        modal={modal}
        setModal={setModal}
        status={status}
        title={"스케쥴 요청"}
        requestUsername={paginatedPage[ind]?.requestUsername}
        detail={detail}
        setDetail={setDetail}
        setStatus={setStatus}
        onSubmitChange={onSubmitChangeTutoring}
        onSubmitDelete={onSubmitDeleteTutoring}
      />

      <AdminScheduleModal
        modal={mailModal}
        setModal={setMailModal}
        title={"메일 보내기"}
        status={null}
        requestUsername={paginatedPage[ind]?.requestUsername}
        detail={detail}
        setDetail={setDetail}
        setStatus={null}
        onSubmitChange={onSubmitMail}
        onSubmitDelete={null}
      />
    </>
  );
};

export default AdminScheduleItems;
