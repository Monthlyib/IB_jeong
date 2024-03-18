import { useDispatch, useSelector } from "react-redux";
import styles from "../BoardCommon.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import BoardCommonHead from "../BoardCommonHead";

import { archiveActions } from "../../../reducers/archive";
import ArchiveItems from "./ArchiveItems";
import ArchiveFolderModal from "./ArchiveFolderModal";
import ArchiveUpperButtons from "./ArchiveUpperButtons";

const ArchiveComponents = () => {
  const dispatch = useDispatch();

  const file = useRef("");
  const closeRef = useRef("");
  const { logInDone } = useSelector((state) => state.user);
  const { getArchiveListDone } = useSelector((state) => state.archive);
  const [currentPath, setCurrentPath] = useState("");
  const [folderTitle, setFolderTitle] = useState("");
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);
  const [level, setLevel] = useState(0);
  const [folderNameModal, setFolderNameModal] = useState(false);
  const [checkParentFolder, setCheckParentFolder] = useState({});
  const { archiveList } = useSelector((state) => state.archive);
  const [archiveListState, setArchiveListState] = useState([]);

  useEffect(() => {
    if (logInDone && getArchiveListDone === false) {
      dispatch(archiveActions.getArchiveListRequest());
    }

    if (getArchiveListDone) {
      setArchiveListState([...archiveList]);
    }
  }, [getArchiveListDone]);

  const findParentFolder = (obj) => {
    const parentFolders = new Set();
    const path = currentPath === "" ? "/" : currentPath;
    const index = currentPath === "" ? 0 : 1;
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].key.split(path)[index] !== undefined) {
        if (obj[i].key.split(path)[index].includes("/")) {
          parentFolders.add(obj[i].key.split(path)[index].split("/")[0]);
        } else {
          parentFolders.add(obj[i].key.split(path)[index]);
        }
      }
    }

    return Array.from(parentFolders);
  };
  useEffect(() => {
    const temp = { ...checkParentFolder };
    if (getArchiveListDone) {
      if (archiveListState.length > 0) {
        temp[level] = findParentFolder(archiveListState);
      } else {
        temp[level] = findParentFolder(archiveList);
      }
    }
    setCheckParentFolder(temp);
  }, [level, archiveListState, archiveList, getArchiveListDone]);

  const onSelectFile = (e) => {
    e.preventDefault();
    e.persist();

    dispatch(
      archiveActions.uploadArchiveRequest({
        currentPath: currentPath + e.target.files[0].name,
        file: e.target.files[0],
      })
    );
  };

  const onClickFolder = useCallback(() => {
    setLevel((prev) => prev + 1);
  }, []);

  const onClickCreateFolder = () => {
    setFolderNameModal((prev) => !prev);
  };

  const onSubmitCreateFolder = () => {
    setArchiveListState([
      ...archiveListState,
      { key: String(currentPath) + folderTitle },
    ]);
  };

  const onClickUpFolder = () => {
    setLevel((prev) => prev - 1);
    if (currentPath !== "") {
      setCurrentPath((prev) => prev.replace(/\w+\/$/g, ""));
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

        {logInDone && (
          <ArchiveUpperButtons
            onClickUpFolder={onClickUpFolder}
            level={level}
            onClickCreateFolder={onClickCreateFolder}
            file={file}
            onSelectFile={onSelectFile}
          />
        )}
        {getArchiveListDone ? (
          <div className={styles.ib_archive_wrap}>
            <div className={styles.ib_archive_cont}>
              {logInDone && checkParentFolder[level]?.length > 0 ? (
                checkParentFolder[level].map((archive, i) => (
                  <ArchiveItems
                    list={archive}
                    onClickFolder={onClickFolder}
                    setCurrentPath={setCurrentPath}
                    key={i}
                    currentPath={currentPath}
                  />
                ))
              ) : logInDone ? (
                <div className={styles.ib_archive_no}>
                  <p>자료가 없습니다.</p>
                </div>
              ) : (
                <div className={styles.ib_archive_no}>
                  <p> 로그인이 필요합니다.</p>
                </div>
              )}
              {folderNameModal && (
                <ArchiveFolderModal
                  closeRef={closeRef}
                  title={folderTitle}
                  setTitle={setFolderTitle}
                  setModal={setFolderNameModal}
                  onSubmitCreateFolder={onSubmitCreateFolder}
                />
              )}
            </div>
          </div>
        ) : (
          <div className={styles.ib_archive_no}>
            <p>로그인이 필요합니다.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default ArchiveComponents;
