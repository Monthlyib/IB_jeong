"use client";
import styles from "@/components/boardComponents/BoardCommon.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import BoardCommonHead from "@/components/boardComponents/BoardCommonHead";

import ArchiveItems from "./ArchiveItems";
import ArchiveFolderModal from "./ArchiveFolderModal";
import ArchiveUpperButtons from "./ArchiveUpperButtons";
import { useSession } from "next-auth/react";
import { useStoreStore } from "@/store/store";

const ArchiveComponents = () => {
  const file = useRef("");
  const closeRef = useRef("");
  const { data: session } = useSession();
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
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);
  const [level, setLevel] = useState(0);
  const [folderNameModal, setFolderNameModal] = useState(false);
  const [archiveListState, setArchiveListState] = useState([]);

  useEffect(() => {
    getMainFolders();
  }, []);

  const onClickFolder = (id) => {
    const temp = [...prevFolderId];
    temp.push(currentFolderId);
    setPrevFolderId(temp);
    setCurrentFolderId(id);
    getSubLists(id, "");
    console.log("clicked");
  };

  const onClickCreateFolder = () => {
    setFolderNameModal((prev) => !prev);
  };

  const onSubmitCreateFolder = (folderName) => {
    if (currentFolderId === 0) postFolder(0, folderName, "MAIN", session);
    else postFolder(currentFolderId, folderName, "SUB", session);
  };
  const onSelectFile = (e) => {
    e.preventDefault();
    e.persist();
    file.current = e.target.files[0];
    postFile(currentFolderId, file.current, session);
  };

  const onClickUpFolder = () => {
    // TODO: current Path 해결해야됨
    const temp = [...prevFolderId];
    setCurrentFolderId(prevFolderId.at(-1));
    const tempStr = currentPath;
    tempStr.replace(tempStr.split(" ").at(-1), "");
    tempStr.replace(tempStr.split(" ").at(-2), "");
    console.log("dd", tempStr);
    // setCurrentPath(tempStr.replace(tempStr.split(" /").at(-1), ""));
    // setCurrentPath(tempStr.replace(tempStr.split(" ").at(-2), ""));
    if (temp.length > 1) {
      getSubLists(temp.at(-1), "");
      temp.pop();
      setPrevFolderId(temp);
    }
  };

  /* 서치기능 구현아직 안됨 */

  const onChangeSearch = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  const onClickSearchButton = useCallback(() => {
    setSearchedPosts([
      ...archiveListState.filter((v) => v.key.includes(searchKeyword)),
    ]);
    setSeraching(true);
  }, [searchKeyword]);

  return (
    <>
      <main className="width_content archive">
        <BoardCommonHead
          searchKeyword={searchKeyword}
          onChangeSearch={onChangeSearch}
          modal={2}
          placeholder="자료실 검색"
        />

        <div className={styles.path_nav}>
          <p>{currentPath}</p>
        </div>

        {session?.authority === "ADMIN" && (
          <ArchiveUpperButtons
            onClickUpFolder={onClickUpFolder}
            currentFolderId={currentFolderId}
            onClickCreateFolder={onClickCreateFolder}
            file={file}
            onSelectFile={onSelectFile}
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
                    key={subLists[k].folderId}
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
