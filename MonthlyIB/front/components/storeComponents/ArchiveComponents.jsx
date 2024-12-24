"use client";
import styles from "@/components/boardComponents/BoardCommon.module.css";
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
  const { mainFolders, subLists, getMainFolders, postFolder, getSubLists, postFile } = useStoreStore();
  const [currentPath, setCurrentPath] = useState("Home");
  const [currentFolderId, setCurrentFolderId] = useState(0);
  const [prevFolderId, setPrevFolderId] = useState([]);
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
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "30px",
                textAlign: "center",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                width: "400px",
              }}
            >
              <h2
                style={{
                  marginBottom: "20px",
                  fontSize: "20px",
                  color: "#5a2d82",
                }}
              >
                로그인 필요
              </h2>
              <p style={{ marginBottom: "30px", fontSize: "16px" }}>
                로그인하시면 더 많은 정보를 확인하실 수 있습니다.
              </p>
              <button
                onClick={handleClosePopup}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#5a2d82",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                확인
              </button>
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
          <p>{currentPath}</p>
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