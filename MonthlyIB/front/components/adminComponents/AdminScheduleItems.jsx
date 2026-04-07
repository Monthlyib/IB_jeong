import styles from "./AdminStyle.module.css";
import Paginatation from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useUserInfo } from "@/store/user";
import { useTutoringStore } from "@/store/tutoring";
import {
  createMailInlineImageEntries,
  dispatchAdminMailJobsRefresh,
  isMailContentEmpty,
  mailPost,
  prepareMailHtmlContent,
  revokeMailInlineImagePreviews,
  validateMailAttachments,
} from "@/apis/mail";
import AdminScheduleModal from "./AdminSchedulemodal";

const formatTime = (hour, minute) => {
  const normalizedHour = String(hour ?? 0).padStart(2, "0");
  const normalizedMinute = String(minute ?? 0).padStart(2, "0");
  return `${normalizedHour}:${normalizedMinute}`;
};

const AdminScheduleItems = ({
  tutoringDateList,
  allTutoringDateList,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const [modal, setModal] = useState(false);
  const [mailModal, setMailModal] = useState(false);
  const [selectedTutoring, setSelectedTutoring] = useState(null);
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [inlineImages, setInlineImages] = useState([]);
  const [mailSubmitting, setMailSubmitting] = useState(false);
  const [status, setStatus] = useState("WAIT");

  const { userInfo } = useUserInfo();
  const { reviseTutoring, deleteTutoring } = useTutoringStore();

  useEffect(() => {
    if (!selectedTutoring) return;
    setDetail(selectedTutoring.detail ?? "");
    setStatus(selectedTutoring.tutoringStatus ?? "WAIT");
  }, [selectedTutoring]);

  const clearMailComposer = () => {
    revokeMailInlineImagePreviews(inlineImages);
    setSubject("");
    setDetail("");
    setAttachments([]);
    setInlineImages([]);
    setMailSubmitting(false);
  };

  const onSubmitChangeTutoring = () => {
    if (!selectedTutoring) return;
    setModal(false);
    reviseTutoring(
      selectedTutoring.tutoringId,
      detail,
      status,
      userInfo,
      currentPage
    );
  };

  const onSubmitMail = async () => {
    if (!selectedTutoring) return;
    if (!subject.trim() || isMailContentEmpty(detail)) {
      alert("메일 제목과 내용을 모두 입력해주세요.");
      return;
    }

    const { activeInlineImages } = prepareMailHtmlContent(detail, inlineImages);
    const validation = validateMailAttachments(attachments, activeInlineImages);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      setMailSubmitting(true);
      await mailPost(
        selectedTutoring.requestUserId,
        subject,
        detail,
        attachments,
        activeInlineImages,
        userInfo
      );
      closeMailModal();
      dispatchAdminMailJobsRefresh();
      alert("메일 전송 요청을 접수했습니다. 백그라운드에서 발송됩니다.");
    } catch (error) {
      alert(error?.response?.data?.message || "메일 전송에 실패했습니다.");
    } finally {
      setMailSubmitting(false);
    }
  };

  const onSubmitDeleteTutoring = () => {
    if (!selectedTutoring) return;
    setModal(false);
    deleteTutoring(selectedTutoring.tutoringId, userInfo, currentPage);
  };

  const onClickEdit = (tutoring) => {
    setSelectedTutoring(tutoring);
    setModal(true);
  };

  const onClickMail = (tutoring) => {
    setSelectedTutoring(tutoring);
    clearMailComposer();
    setMailModal(true);
  };

  const onAddAttachments = (nextFiles) => {
    const nextAttachments = [...attachments, ...nextFiles];
    const validation = validateMailAttachments(nextAttachments);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    setAttachments(nextAttachments);
  };

  const onRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const onPrepareInlineImages = (files) => {
    const nextInlineImages = createMailInlineImageEntries(files);
    const validation = validateMailAttachments(attachments, [
      ...inlineImages,
      ...nextInlineImages,
    ]);
    if (!validation.valid) {
      revokeMailInlineImagePreviews(nextInlineImages);
      alert(validation.message);
      return null;
    }

    setInlineImages((prev) => [...prev, ...nextInlineImages]);
    return nextInlineImages;
  };

  const closeMailModal = () => {
    clearMailComposer();
    setMailModal(false);
  };

  return (
    <>
      <div className={styles.scheduleBody}>
        {tutoringDateList?.length > 0 ? (
          tutoringDateList.map((tutoring) => (
            <div key={tutoring.tutoringId} className={styles.scheduleRowWrap}>
              <div className={`${styles.schedule} ${styles.scheduleGrid}`}>
                <div className={styles.scheduleCell}>{tutoring.requestUsername}</div>
                <div className={styles.scheduleCell}>
                  {tutoring.requestUserNickName}
                </div>
                <div className={styles.scheduleCell}>{tutoring.date}</div>
                <div className={styles.scheduleCell}>
                  {formatTime(tutoring.hour, tutoring.minute)}
                </div>
                <div className={styles.scheduleCell}>
                  {tutoring.tutoringStatus === "WAIT" ? "대기" : "확정"}
                </div>
                <div className={`${styles.scheduleCell} ${styles.scheduleTools}`}>
                  <FontAwesomeIcon
                    icon={faPen}
                    onClick={() => onClickEdit(tutoring)}
                  />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    onClick={() => onClickMail(tutoring)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyTableState}>
            표시할 스케줄 데이터가 없습니다.
          </div>
        )}
      </div>

      {allTutoringDateList?.length > 0 && (
        <Paginatation
          contents={allTutoringDateList}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}

      <AdminScheduleModal
        modal={modal}
        setModal={setModal}
        status={status}
        title={"스케줄 요청"}
        requestUsername={selectedTutoring?.requestUsername}
        detail={detail}
        setDetail={setDetail}
        setStatus={setStatus}
        onSubmitChange={onSubmitChangeTutoring}
        onSubmitDelete={onSubmitDeleteTutoring}
      />

      <AdminScheduleModal
        modal={mailModal}
        setModal={setMailModal}
        onClose={closeMailModal}
        title={"메일 보내기"}
        status={null}
        requestUsername={selectedTutoring?.requestUsername}
        subject={subject}
        setSubject={setSubject}
        detail={detail}
        setDetail={setDetail}
        setStatus={null}
        onSubmitChange={onSubmitMail}
        onSubmitDelete={null}
        showMailFields={true}
        attachments={attachments}
        onAddAttachments={onAddAttachments}
        onRemoveAttachment={onRemoveAttachment}
        onPrepareInlineImages={onPrepareInlineImages}
        mailSubmitting={mailSubmitting}
        submitDisabled={mailSubmitting || !subject.trim() || isMailContentEmpty(detail)}
      />
    </>
  );
};

export default AdminScheduleItems;
