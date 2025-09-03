"use client";
import styles from "@/components/storeComponents/Archive.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import BoardCommonHead from "@/components/boardComponents/BoardCommonHead";
import shortid from "shortid";
import ArchiveItems from "./ArchiveItems";
import ArchiveFolderModal from "./ArchiveFolderModal";
import ArchiveUpperButtons from "./ArchiveUpperButtons";
import { useStoreStore } from "@/store/store";
import { useUserInfo } from "@/store/user";
import { useRouter } from "next/navigation"; // useRouter 추가

const ArchiveComponents = () => {
  const file = useRef("");
  const closeRef = useRef("");
  const [key, setKey] = useState(Date.now());
  const { userInfo } = useUserInfo();
  const {
    mainFolders,
    subLists,
    getMainFolders,
    postFolder,
    getSubLists,
    postFile,
    fileUploading,
    fileUploadPct,
    fileUploadName,
    fileUploadError,
    cancelUpload,
  } = useStoreStore();
  const [currentPath, setCurrentPath] = useState("Home");
  const [currentFolderId, setCurrentFolderId] = useState(0);
  const [prevFolderId, setPrevFolderId] = useState([]);

  // Breadcrumb helpers (names from currentPath, ids from prevFolderId + currentFolderId)
  const breadcrumbNames = currentPath.split(" / ");
  const breadcrumbIds = [0, ...prevFolderId, currentFolderId];

  const onClickBreadcrumb = (index) => {
    // index-th crumb was clicked
    const targetId = breadcrumbIds[index] ?? 0;
    const nextNames = breadcrumbNames.slice(0, index + 1);

    // Rebuild prev stack to match the target depth (everything before target becomes prev)
    const nextPrev = breadcrumbIds.slice(0, index); // excludes current at index

    setPrevFolderId(nextPrev);
    setCurrentFolderId(targetId);
    setCurrentPath(nextNames.join(" / "));

    if (targetId === 0) {
      getMainFolders();
    } else {
      getSubLists(targetId, "");
    }
  };

  const [folderTitle, setFolderTitle] = useState("");
  const searchKeyword = useRef();
  const [searching, setSeraching] = useState(false);
  const [folderNameModal, setFolderNameModal] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태
  const router = useRouter(); // Router 추가

  // 컴포넌트가 마운트될 때 폴더 리스트를 가져옵니다.
  useEffect(() => {
    const search = searchKeyword.current === undefined ? "" : searchKeyword.current;
    if (searching) {
      getSubLists("", search);
    } else getMainFolders();

    // 로그인 여부 확인 및 팝업 표시
    // Show popup if user is not logged in
    console.log(userInfo);
    if (userInfo?.authority === undefined) {
      setIsPopupOpen(true);
    }
  }, [searching]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    router.push("/login"); // 로그인 페이지로 이동
  };

  const onClickFolder = (id) => {
    const temp = [...prevFolderId];
    temp.push(currentFolderId);
    setPrevFolderId(temp);
    setCurrentFolderId(id);
    getSubLists(id, "");
  };

  const onClickCreateFolder = () => {
    setFolderNameModal((prev) => !prev);
  };

  const onSubmitCreateFolder = (folderName) => {
    if (currentFolderId === 0) postFolder(0, folderName, "MAIN", userInfo);
    else postFolder(currentFolderId, folderName, "SUB", userInfo);
    setFolderTitle("");
  };

  const onSelectFile = (e) => {
    e.preventDefault();
    e.persist();
    file.current = e.target.files[0];
    postFile(currentFolderId, file.current, userInfo);
    setKey(Date.now());
  };

  const onClickUpFolder = () => {
    const temp = [...prevFolderId];
    setCurrentFolderId(prevFolderId.at(-1));
    const pos = currentPath.lastIndexOf("/");
    const tempStr = currentPath.substring(0, pos);
    setCurrentPath(tempStr);
    if (temp.length > 1) {
      getSubLists(temp.at(-1), "");
      temp.pop();
      setPrevFolderId(temp);
    }
  };

  return (
    <>
      <main className="width_content archive">
        {/* 팝업 모달 */}
        {isPopupOpen && (
          <div className="popupOverlay">
            <div className="popupCard">
              <h2 className="popupTitle">로그인 필요</h2>
              <p className="popupText">로그인하시면 더 많은 정보를 확인하실 수 있습니다.</p>
              <button onClick={handleClosePopup} className="popupConfirmBtn">확인</button>
            </div>
          </div>
        )}

        {/* 업로드 진행 다이얼로그 */}
        {fileUploading && (
          <div className="uploadOverlay">
            <div className="uploadDialog">
              <h3 className="uploadTitle">파일 업로드 중…</h3>
              <p className="uploadFileName">{fileUploadName || "파일"}</p>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{ width: `${Math.min(100, Math.max(0, fileUploadPct || 0))}%` }}
                />
              </div>
              <div className="uploadFooter">
                <span className="uploadPercent">{fileUploadPct || 0}%</span>
                <button onClick={cancelUpload} className="uploadCancelBtn">취소</button>
              </div>
              {fileUploadError && (
                <p className="uploadError">업로드 실패: {String(fileUploadError)}</p>
              )}
            </div>
          </div>
        )}

        {/* 상단 검색 헤더 */}
        <BoardCommonHead
          searchKeyword={searchKeyword}
          setSeraching={setSeraching}
          modal={2}
          placeholder="자료실 검색"
        />

        <div className={styles.path_nav}>
          <nav aria-label="breadcrumb" className={styles.breadcrumbNav}>
            {breadcrumbNames.map((name, idx) => (
              <span key={`crumb-${idx}`} className={styles.breadcrumbItem}>
                <button
                  type="button"
                  onClick={() => onClickBreadcrumb(idx)}
                  className={`${styles.breadcrumbBtn} ${idx === breadcrumbNames.length - 1 ? styles.isActive : ""}`}
                  disabled={idx === breadcrumbNames.length - 1}
                >
                  {name}
                </button>
                {idx !== breadcrumbNames.length - 1 && <span className={styles.breadcrumbSep}>/</span>}
              </span>
            ))}
          </nav>
        </div>

        <ArchiveUpperButtons
          authority={userInfo?.authority}
          onClickUpFolder={onClickUpFolder}
          currentFolderId={currentFolderId}
          onClickCreateFolder={onClickCreateFolder}
          file={file}
          onSelectFile={onSelectFile}
          key={shortid.generate()}
        />

        {currentFolderId !== 0 ? (
          subLists["folders"]?.length > 0 || subLists["files"]?.length > 0 ? (
            <div className={styles.ib_archive_wrap}>
              <div className={styles.ib_archive_cont}>
                {Object.keys(subLists).map((k) => (
                  <ArchiveItems
                    folders={subLists[k]}
                    type={k}
                    id={k.folderId}
                    onClickFolder={onClickFolder}
                    setCurrentPath={setCurrentPath}
                    key={shortid.generate()}
                    currentFolderId={currentFolderId}
                    onClickUpFolder={onClickUpFolder}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.ib_archive_no}>
              <p>자료가 없습니다.</p>
            </div>
          )
        ) : mainFolders.length > 0 ? (
          <div className={styles.ib_archive_wrap}>
            <div className={styles.ib_archive_cont}>
              <ArchiveItems
                folders={mainFolders}
                type="folders"
                onClickFolder={onClickFolder}
                setCurrentPath={setCurrentPath}
                currentFolderId={currentFolderId}
              />
            </div>
          </div>
        ) : (
          <div className={styles.ib_archive_no}>
            <p>자료가 없습니다.</p>
          </div>
        )}

        {folderNameModal === true && (
          <ArchiveFolderModal
            closeRef={closeRef}
            title={folderTitle}
            setTitle={setFolderTitle}
            setModal={setFolderNameModal}
            onSubmitCreateFolder={onSubmitCreateFolder}
          />
        )}
      </main>
    </>
  );
};

export default ArchiveComponents;