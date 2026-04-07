import { useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./AdminStyle.module.css";
import {
  MAIL_ATTACHMENT_ACCEPT,
  MAIL_ATTACHMENT_MAX_COUNT,
  MAIL_ATTACHMENT_MAX_TOTAL_SIZE,
  formatMailAttachmentSize,
} from "@/apis/mail";

const AdminMailEditor = dynamic(() => import("./AdminMailEditor"), {
  ssr: false,
});

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
  attachments = [],
  onAddAttachments,
  onRemoveAttachment,
  onPrepareInlineImages,
  onClose,
  mailSubmitting = false,
  submitDisabled = false,
  calendarSyncStatus,
  calendarSyncError,
  calendarHtmlLink,
  calendarSyncedAt,
  onSubmitCalendarSync,
  calendarSyncSubmitting = false,
}) => {
  const closeRef = useRef();
  const fileInputRef = useRef(null);
  const totalAttachmentSize = attachments.reduce(
    (sum, attachment) => sum + (attachment?.size ?? 0),
    0
  );

  const closeModal = () => {
    if (onClose) {
      onClose();
      return;
    }
    setModal(false);
  };

  return (
    <>
      {modal === true && (
        <div className={styles.md}>
          <div
            className={styles.md_box_flex}
            ref={closeRef}
            onClick={(e) => closeRef.current === e.target && closeModal()}
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
                  {showMailFields ? (
                    <div className={styles.mailEditorField}>
                      <AdminMailEditor
                        className={styles.mailEditor}
                        value={detail}
                        onChange={setDetail}
                        onPrepareInlineImages={onPrepareInlineImages}
                      />
                      <div className={styles.mailEditorHint}>
                        이미지를 드래그하거나 붙여넣으면 본문 안에 바로 삽입됩니다.
                      </div>
                    </div>
                  ) : (
                    <textarea
                      className={styles.modalTextarea}
                      value={detail}
                      onChange={(e) => {
                        setDetail(e.target.value);
                      }}
                    />
                  )}
                </div>
                {showMailFields && (
                  <div className={styles.attachmentSection}>
                    <div className={styles.attachmentToolbar}>
                      <div>
                        <div className={styles.modalFieldLabel}>첨부파일</div>
                        <div className={styles.attachmentHint}>
                          본문 이미지와 첨부파일을 합쳐 최대 {MAIL_ATTACHMENT_MAX_COUNT}개,
                          총 {formatMailAttachmentSize(MAIL_ATTACHMENT_MAX_TOTAL_SIZE)}
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={MAIL_ATTACHMENT_ACCEPT}
                        className={styles.hiddenFileInput}
                        onChange={(e) => {
                          const nextFiles = Array.from(e.target.files || []);
                          onAddAttachments?.(nextFiles);
                          e.target.value = "";
                        }}
                      />
                      <button
                        type="button"
                        className={styles.attachmentTrigger}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        파일 선택
                      </button>
                    </div>

                    <div className={styles.attachmentSummary}>
                      {attachments.length}개 선택됨 · 총{" "}
                      {formatMailAttachmentSize(totalAttachmentSize)}
                    </div>

                    {attachments.length > 0 ? (
                      <div className={styles.attachmentList}>
                        {attachments.map((attachment, index) => (
                          <div
                            key={`${attachment.name}-${attachment.size}-${index}`}
                            className={styles.attachmentItem}
                          >
                            <div className={styles.attachmentMeta}>
                              <span className={styles.attachmentName}>
                                {attachment.name}
                              </span>
                              <span>{formatMailAttachmentSize(attachment.size)}</span>
                            </div>
                            <button
                              type="button"
                              className={styles.attachmentRemoveButton}
                              onClick={() => onRemoveAttachment?.(index)}
                            >
                              제거
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.attachmentEmpty}>
                        선택된 첨부파일이 없습니다.
                      </div>
                    )}
                  </div>
                )}
                {!showMailFields && (
                  <div className={styles.modalInfoCard}>
                    <div className={styles.modalFieldLabel}>Google Calendar</div>
                    <div className={styles.calendarSyncStack}>
                      <span
                        className={`${styles.calendarSyncBadge} ${
                          calendarSyncStatus === "FAILED"
                            ? styles.calendarSyncBadgeFailed
                            : calendarSyncStatus === "PENDING"
                              ? styles.calendarSyncBadgePending
                              : styles.calendarSyncBadgeSynced
                        }`}
                      >
                        {calendarSyncStatus === "FAILED"
                          ? "연동 실패"
                          : calendarSyncStatus === "PENDING"
                            ? "연동 대기"
                            : calendarSyncStatus === "SYNCED"
                              ? "연동 완료"
                              : "미연동"}
                      </span>
                      {calendarHtmlLink ? (
                        <a
                          href={calendarHtmlLink}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={styles.calendarSyncLink}
                        >
                          Google Calendar 열기
                        </a>
                      ) : null}
                    </div>
                    {calendarSyncedAt ? (
                      <div className={styles.modalMetaText}>
                        마지막 동기화: {String(calendarSyncedAt).replace("T", " ")}
                      </div>
                    ) : null}
                    {calendarSyncError ? (
                      <div className={styles.calendarSyncError}>
                        {calendarSyncError}
                      </div>
                    ) : null}
                    {onSubmitCalendarSync ? (
                      <div className={styles.modalActionRow}>
                        <button
                          type="button"
                          className={styles.modalSecondaryButton}
                          onClick={onSubmitCalendarSync}
                          disabled={calendarSyncSubmitting}
                        >
                          {calendarSyncSubmitting
                            ? "재동기화 중..."
                            : "캘린더 재동기화"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
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
                      <option value="CANCEL">취소</option>
                    </select>
                  </>
                )}
              </div>
              <div className={styles.btn_wrap}>
                <button
                  type="button"
                  className={styles.ok}
                  onClick={onSubmitChange}
                  disabled={submitDisabled}
                >
                  {mailSubmitting ? "전송 중..." : "확인"}
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
