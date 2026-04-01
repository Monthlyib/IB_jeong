"use client";
import styles from "@/components/storeComponents/ArchiveComponents.module.css";
import boardStyles from "@/components/boardComponents/BoardCommon.module.css";
import { useEffect, useRef, useState } from "react";
import BoardCommonHead from "@/components/boardComponents/BoardCommonHead";
import shortid from "shortid";
import ArchiveItems from "./ArchiveItems";
import ArchiveFolderModal from "./ArchiveFolderModal";
import ArchiveUpperButtons from "./ArchiveUpperButtons";
import { useStoreStore } from "@/store/store";
import { useUserInfo, useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";

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
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbNames = currentPath.split(" / ");
  const breadcrumbIds = [...prevFolderId, currentFolderId];

  const onClickBreadcrumb = (index) => {
    const targetId = breadcrumbIds[index] ?? 0;
    const nextNames = breadcrumbNames.slice(0, index + 1);
    const nextPrev = breadcrumbIds.slice(0, index);

    setPrevFolderId(nextPrev);
    setCurrentFolderId(targetId);
    setCurrentPath(nextNames.join(" / "));
    setSearchInput("");
    setSearchQuery("");

    if (targetId === 0) {
      getMainFolders();
    } else {
      getSubLists(targetId, "");
    }
  };

  const [folderTitle, setFolderTitle] = useState("");
  const [folderNameModal, setFolderNameModal] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const router = useRouter();
  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore();
  const isSearchMode = searchQuery.trim().length > 0;

  useEffect(() => {
    if (isSearchMode) {
      getSubLists("", searchQuery);
      return;
    }

    if (currentFolderId === 0) {
      getMainFolders();
      return;
    }

    getSubLists(currentFolderId, "");
  }, [currentFolderId, getMainFolders, getSubLists, isSearchMode, searchQuery]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    const persistedUser = localUser?.state?.userInfo;

    setIsPopupOpen(!persistedUser?.authority);
    setAuthResolved(true);

    if (localUser?.state?.userInfo?.userId) {
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
    }
  }, [getUserSubscribeInfo]);


  
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    router.push("/login");
  };

  const onClickFolder = (id) => {
    setSearchInput("");
    setSearchQuery("");
    const temp = [...prevFolderId];
    temp.push(currentFolderId);
    setPrevFolderId(temp);
    setCurrentFolderId(id);
    getSubLists(id, "");
  };

  const handleSearch = () => {
    const nextQuery = searchInput.trim();
    setPrevFolderId([]);
    setCurrentPath("Home");
    setCurrentFolderId(0);
    setSearchQuery(nextQuery);
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
    setSearchInput("");
    setSearchQuery("");
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

  const visibleFolders =
    isSearchMode || currentFolderId !== 0
      ? Array.isArray(subLists["folders"])
        ? subLists["folders"].length
        : 0
      : Array.isArray(mainFolders)
        ? mainFolders.length
        : 0;

  const visibleFiles =
    (isSearchMode || currentFolderId !== 0) && Array.isArray(subLists["files"])
      ? subLists["files"].length
      : 0;

  const canOpenFiles =
    userInfo?.authority === "ADMIN" ||
    userSubscribeInfo?.[0]?.subscribeStatus === "ACTIVE" ||
    userSubscribeInfo?.[0]?.userId === 1;

  const currentFolderLabel =
    isSearchMode
      ? "검색 결과"
      : currentFolderId === 0
        ? "메인 드라이브"
        : breadcrumbNames[breadcrumbNames.length - 1];

  return (
    <>
      <main className={`width_content archive ${boardStyles.boardPage}`}>
        {authResolved && isPopupOpen && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupCard}>
              <h2 className={styles.popupTitle}>로그인 필요</h2>
              <p className={styles.popupText}>로그인하시면 더 많은 정보를 확인하실 수 있습니다.</p>
              <button onClick={handleClosePopup} className={styles.popupConfirmBtn}>확인</button>
            </div>
          </div>
        )}

        {fileUploading && (
          <div className={styles.uploadOverlay}>
            <div className={styles.uploadDialog}>
              <h3 className={styles.uploadTitle}>파일 업로드 중…</h3>
              <p className={styles.uploadFileName}>{fileUploadName || "파일"}</p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${Math.min(100, Math.max(0, fileUploadPct || 0))}%` }}
                />
              </div>
              <div className={styles.uploadFooter}>
                <span className={styles.uploadPercent}>{fileUploadPct || 0}%</span>
                <button onClick={cancelUpload} className={styles.uploadCancelBtn}>취소</button>
              </div>
              {fileUploadError && (
                <p className={styles.uploadError}>업로드 실패: {String(fileUploadError)}</p>
              )}
            </div>
          </div>
        )}

        <BoardCommonHead
          modal={2}
          eyebrow="Monthly IB Drive"
          title="자료실"
          description="메인 폴더부터 세부 자료까지 한 흐름으로 이동하고, 필요한 폴더와 파일을 검색해 바로 이어서 확인할 수 있습니다."
          search={{
            label: "자료실 검색",
            placeholder: "자료실 검색",
            value: searchInput,
            onChange: setSearchInput,
            onSubmit: handleSearch,
          }}
          stats={[
            { label: "현재 위치", value: currentFolderLabel },
            { label: "보이는 폴더", value: visibleFolders },
            { label: "보이는 파일", value: visibleFiles },
            {
              label: "열람 상태",
              value: canOpenFiles ? "Unlocked" : "구독 필요",
            },
          ]}
        />

        <section className={styles.archiveToolbar}>
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
            <p className={styles.toolbarCaption}>
              {isSearchMode
                ? `'${searchQuery}' 검색 결과입니다. 폴더와 파일을 바로 열어볼 수 있습니다.`
                : currentFolderId === 0
                ? "메인 폴더에서 과목별 자료 흐름을 시작하세요."
                : "하위 폴더와 파일을 한 화면에서 관리할 수 있습니다."}
            </p>
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
        </section>

        {isSearchMode || currentFolderId !== 0 ? (
          subLists["folders"]?.length > 0 || subLists["files"]?.length > 0 ? (
            <div className={styles.ib_archive_wrap}>
              <div className={styles.driveGrid}>
                <section className={styles.driveSection}>
                  <div className={styles.driveSectionHeader}>
                    <div>
                      <h4>하위 폴더</h4>
                    </div>
                    <span className={styles.sectionCount}>{visibleFolders}</span>
                  </div>
                  {subLists["folders"]?.length > 0 ? (
                    <div className={styles.driveList}>
                      <ArchiveItems
                        folders={subLists["folders"]}
                        type="folders"
                        onClickFolder={onClickFolder}
                        setCurrentPath={setCurrentPath}
                        key={`folders-${currentFolderId}`}
                        currentFolderId={currentFolderId}
                        canOpenFiles={canOpenFiles}
                      />
                    </div>
                  ) : (
                    <div className={styles.emptySection}>하위 폴더가 없습니다.</div>
                  )}
                </section>

                <section className={styles.driveSection}>
                  <div className={styles.driveSectionHeader}>
                    <div>
                      <h4>자료 파일</h4>
                    </div>
                    <span className={styles.sectionCount}>{visibleFiles}</span>
                  </div>
                  {subLists["files"]?.length > 0 ? (
                    <div className={styles.driveList}>
                      <ArchiveItems
                        folders={subLists["files"]}
                        type="files"
                        onClickFolder={onClickFolder}
                        setCurrentPath={setCurrentPath}
                        key={`files-${currentFolderId}`}
                        currentFolderId={currentFolderId}
                        canOpenFiles={canOpenFiles}
                      />
                    </div>
                  ) : (
                    <div className={styles.emptySection}>이 폴더에는 파일이 없습니다.</div>
                  )}
                </section>
              </div>
            </div>
          ) : (
            <div className={styles.ib_archive_no}>
              <p>자료가 없습니다.</p>
            </div>
          )
        ) : mainFolders.length > 0 ? (
          <div className={styles.ib_archive_wrap}>
            <section className={styles.driveSection}>
              <div className={styles.driveSectionHeader}>
                <div>
                  <h4>메인 폴더</h4>
                </div>
                <span className={styles.sectionCount}>{visibleFolders}</span>
              </div>
              <div className={styles.driveList}>
                <ArchiveItems
                  folders={mainFolders}
                  type="folders"
                  onClickFolder={onClickFolder}
                  setCurrentPath={setCurrentPath}
                  currentFolderId={currentFolderId}
                  canOpenFiles={canOpenFiles}
                />
              </div>
            </section>
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
