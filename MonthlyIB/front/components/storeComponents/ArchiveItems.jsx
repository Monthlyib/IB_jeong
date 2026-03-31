"use client";
import styles from "@/components/storeComponents/ArchiveComponents.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faFile,
  faFilePdf,
  faFolder,
  faLock,
  faPenAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useStoreStore } from "@/store/store";
import ArchiveFolderModal from "./ArchiveFolderModal";
import { useRef, useState } from "react";
import { useUserInfo } from "@/store/user";

// ArchiveItems 컴포넌트: 폴더와 파일 항목을 렌더링하고, 권한에 따라 수정, 삭제 기능을 제공합니다.
const ArchiveItems = ({
  folders,
  type,
  onClickFolder,
  setCurrentPath,
  currentFolderId,
  canOpenFiles,
}) => {
  const closeRef = useRef();
  const [modal, setModal] = useState(false);
  const [storageFolderId, setStorageFolderId] = useState(0);
  const [folderTitle, setFolderTitle] = useState("");
  const { deleteFolder, deleteFile, reviseFolder } = useStoreStore();
  const { userInfo } = useUserInfo();

  const getFileKind = (fileName = "") => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith(".pdf")) return "PDF";
    if (lowerName.endsWith(".zip")) return "ZIP";
    if (lowerName.endsWith(".doc") || lowerName.endsWith(".docx")) return "DOC";
    if (lowerName.endsWith(".ppt") || lowerName.endsWith(".pptx")) return "PPT";
    return "FILE";
  };

  // 폴더 삭제 함수
  const onClickDeleteFolder = (folderId) => {
    deleteFolder(folderId, currentFolderId, userInfo);
  };

  // 파일 삭제 함수
  const onClickDeleteFile = (fileId) => {
    deleteFile(fileId, currentFolderId, userInfo);
  };

  // 폴더 이름 수정 모달을 열고 수정할 폴더 ID를 설정
  const onClickReviseFolderName = (folderId) => {
    setModal(true);
    setStorageFolderId(folderId);
  };

  // 폴더 수정 제출 함수
  const onSubmitReviseFolder = (folderName) => {
    const status = currentFolderId === 0 ? "MAIN" : "SUB";
    reviseFolder(
      currentFolderId,
      storageFolderId,
      folderName,
      status,
      userInfo
    );
  };

  const onClickFile = (fileUrl) => {
    if (canOpenFiles) {
      const newWindow = window.open(fileUrl, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    }
  };

  return (
    <>
      {/* 폴더 목록을 렌더링합니다. */}
      {type === "folders" &&
        folders.map((f) => (
          <div
            className={`${styles.driveItem} ${styles.folderItem}`}
            datatype="folder"
            onClick={() => {
              onClickFolder(f.folderId);
              setCurrentPath((prev) => prev + " / " + f.name);
            }}
            key={f.folderId}
          >
            <div className={styles.driveItemBox}>
              <div className={styles.driveItemMain}>
                <span className={styles.driveIcon}>
                  <FontAwesomeIcon icon={faFolder} />
                </span>
                <div className={styles.driveText}>
                  <strong>{f.name}</strong>
                  <span>Folder</span>
                </div>
              </div>
              <div className={styles.driveItemMeta}>
                <span className={styles.drivePill}>열기</span>
                <FontAwesomeIcon icon={faChevronRight} className={styles.driveChevron} />
              </div>

              {userInfo?.authority === "ADMIN" && (
                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickReviseFolderName(f.folderId);
                    }}
                  >
                    <FontAwesomeIcon icon={faPenAlt} />
                  </button>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickDeleteFolder(f.folderId);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

      {type === "files" &&
        folders.map((f) => (
          <div
            className={`${styles.driveItem} ${styles.fileItem} ${!canOpenFiles ? styles.isLocked : ""}`}
            datatype="file"
            key={f.fileId}
            onClick={() => onClickFile(f.fileUrl)}
          >
            <div className={styles.driveItemBox}>
              <div className={styles.driveItemMain}>
                <span className={`${styles.driveIcon} ${styles.fileIcon}`}>
                  <FontAwesomeIcon
                    icon={getFileKind(f.fileName) === "PDF" ? faFilePdf : faFile}
                  />
                </span>
                <div className={styles.driveText}>
                  <strong>{f.fileName}</strong>
                  <span>{canOpenFiles ? `${getFileKind(f.fileName)} file` : "구독 후 열람 가능"}</span>
                </div>
              </div>
              <div className={styles.driveItemMeta}>
                <span className={styles.drivePill}>{getFileKind(f.fileName)}</span>
                {!canOpenFiles && (
                  <span className={styles.lockBadge}>
                    <FontAwesomeIcon icon={faLock} />
                    Locked
                  </span>
                )}
              </div>

              {userInfo?.authority === "ADMIN" && (
                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickDeleteFile(f.fileId);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

      {modal && (
        <ArchiveFolderModal
          closeRef={closeRef}
          title={folderTitle}
          type="edit"
          setTitle={setFolderTitle}
          setModal={setModal}
          onSubmitCreateFolder={onSubmitReviseFolder}
        />
      )}
    </>
  );
};

export default ArchiveItems;
