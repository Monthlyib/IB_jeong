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
  } = useStoreStore();
  const [currentPath, setCurrentPath] = useState("Home");
  const [currentFolderId, setCurrentFolderId] = useState(0);
  const [prevFolderId, setPrevFolderId] = useState([]);
  const [folderTitle, setFolderTitle] = useState("");
  const searchKeyword = useRef();
  const [searching, setSeraching] = useState(false);
  const [level, setLevel] = useState(0);
  const [folderNameModal, setFolderNameModal] = useState(false);

  useEffect(() => {
    const search =
      searchKeyword.current === undefined ? "" : searchKeyword.current;

    if (searching) {
      getSubLists("", search);
    } else getMainFolders();
  }, [searching]);

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
        <BoardCommonHead
          searchKeyword={searchKeyword}
          setSeraching={setSeraching}
          modal={2}
          placeholder="자료실 검색"
        />

        <div className={styles.path_nav}>
          <p>{currentPath}</p>
        </div>

        {userInfo?.authority === "ADMIN" && (
          <ArchiveUpperButtons
            onClickUpFolder={onClickUpFolder}
            currentFolderId={currentFolderId}
            onClickCreateFolder={onClickCreateFolder}
            file={file}
            onSelectFile={onSelectFile}
            key={key}
          />
        )}
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
