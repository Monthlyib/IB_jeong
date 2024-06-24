"use client";
import styles from "@/components/boardComponents/BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFile,
  faTrashAlt,
  faPenAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useStoreStore } from "@/store/store";
import ArchiveFolderModal from "./ArchiveFolderModal";
import { useRef, useState } from "react";
import { useUserStore } from "@/store/user";

const ArchiveItems = ({
  folders,
  type,
  onClickFolder,
  setCurrentPath,
  currentFolderId,
}) => {
  const closeRef = useRef();
  const [modal, setModal] = useState(false);
  const [storageFolderId, setStorageFolderId] = useState(0);
  const [folderTitle, setFolderTitle] = useState("");
  const { deleteFolder, deleteFile, reviseFolder } = useStoreStore();
  const onClickDeleteFolder = (folderId) => {
    deleteFolder(folderId, currentFolderId, userInfo);
  };
  const onClickDeleteFile = (fileId) => {
    deleteFile(fileId, currentFolderId, userInfo);
  };

  const onClickReviseFolderName = (folderId) => {
    setModal(true);
    setStorageFolderId(folderId);
  };
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
    const newWindow = window.open(fileUrl, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
  const { userInfo } = useUserStore();
  return (
    <>
      {type === "folders" &&
        folders.map((f) => (
          <div
            className={styles.ib_archive_list}
            datatype="folder"
            onClick={() => {
              onClickFolder(f.folderId);
              setCurrentPath((prev) => prev + " / " + f.name);
            }}
            key={f.folderId}
          >
            <div className={styles.ib_archive_box}>
              <div className={styles.ib_archive_info}>
                <FontAwesomeIcon icon={faFolder} />
                <span>{f.name}</span>
              </div>

              {userInfo?.authority === "ADMIN" && (
                <div className={styles.options}>
                  <button
                    type="button"
                    id="revise"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickReviseFolderName(f.folderId);
                    }}
                  >
                    <FontAwesomeIcon icon={faPenAlt} />
                  </button>
                  <button
                    type="button"
                    id="delete"
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
            className={styles.ib_archive_list}
            datatype="file"
            key={f.fileId}
            onClick={() => onClickFile(f.fileUrl)}
          >
            <div className={styles.ib_archive_box}>
              <div className={styles.ib_archive_info}>
                <FontAwesomeIcon icon={faFile} />
                <span>{f.fileName}</span>
              </div>

              {userInfo?.authority === "ADMIN" && (
                <div className={styles.options}>
                  <button
                    type="button"
                    id="delete"
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
