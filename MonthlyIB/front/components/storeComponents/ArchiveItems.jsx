"use client";
import styles from "@/components/boardComponents/BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFile, faTrashAlt, faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useStoreStore } from "@/store/store";
import ArchiveFolderModal from "./ArchiveFolderModal";
import { useEffect, useRef, useState } from "react";
import { useUserInfo, useUserStore } from "@/store/user";

// ArchiveItems 컴포넌트: 폴더와 파일 항목을 렌더링하고, 권한에 따라 수정, 삭제 기능을 제공합니다.
const ArchiveItems = ({
  folders, // 폴더 또는 파일 목록
  type, // 항목 타입 ("folders" or "files")
  onClickFolder, // 폴더 클릭 시 호출되는 함수
  setCurrentPath, // 현재 경로를 업데이트하는 함수
  currentFolderId, // 현재 폴더의 ID
}) => {
  const closeRef = useRef(); // 모달을 닫기 위한 ref
  const [modal, setModal] = useState(false); // 수정 모달 상태
  const [storageFolderId, setStorageFolderId] = useState(0); // 수정할 폴더 ID
  const [folderTitle, setFolderTitle] = useState(""); // 폴더 제목
  const { deleteFolder, deleteFile, reviseFolder } = useStoreStore(); // 스토어에서 폴더/파일 삭제 및 수정 함수
  const { userInfo } = useUserInfo(); // 사용자 정보
  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore(); // 구독 정보 가져오기 위한 스토어

  // 컴포넌트 마운트 시 사용자 구독 정보를 로드합니다.
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    if (localUser)
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
  }, []);

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

  // 파일 클릭 시 URL을 새 창으로 엽니다. 구독 상태가 "ACTIVE"일 때만 파일을 열 수 있습니다.
  const onClickFile = (fileUrl) => {
    if (userSubscribeInfo?.[0]?.subscribeStatus === "ACTIVE") {
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

              {/* ADMIN 권한이 있는 사용자만 수정 및 삭제 버튼이 보입니다. */}
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

      {/* 파일 목록을 렌더링합니다. */}
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

              {/* ADMIN 권한이 있는 사용자만 파일 삭제 버튼이 보입니다. */}
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

      {/* 폴더 이름 수정 모달 */}
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
