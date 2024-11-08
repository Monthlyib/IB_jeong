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

// ArchiveComponents: 파일과 폴더를 관리하는 자료실 컴포넌트
const ArchiveComponents = () => {
  const file = useRef(""); // 업로드할 파일을 참조하는 ref
  const closeRef = useRef(""); // 모달을 닫기 위한 ref
  const [key, setKey] = useState(Date.now()); // 파일 input의 고유 key
  const { userInfo } = useUserInfo(); // 사용자 정보 가져오기
  const { mainFolders, subLists, getMainFolders, postFolder, getSubLists, postFile } = useStoreStore(); // 폴더, 파일 데이터와 관련된 스토어 함수들
  const [currentPath, setCurrentPath] = useState("Home"); // 현재 경로를 저장
  const [currentFolderId, setCurrentFolderId] = useState(0); // 현재 폴더 ID
  const [prevFolderId, setPrevFolderId] = useState([]); // 이전 폴더 ID 저장
  const [folderTitle, setFolderTitle] = useState(""); // 새 폴더 제목
  const searchKeyword = useRef(); // 검색 키워드 ref
  const [searching, setSeraching] = useState(false); // 검색 상태 관리
  const [folderNameModal, setFolderNameModal] = useState(false); // 폴더 생성 모달 상태 관리

  // 컴포넌트가 마운트될 때 폴더 리스트를 가져옵니다. 검색 중이면 검색 결과를 가져옴
  useEffect(() => {
    const search = searchKeyword.current === undefined ? "" : searchKeyword.current;
    if (searching) {
      getSubLists("", search);
    } else getMainFolders();
  }, [searching]);

  // 폴더를 클릭해 하위 폴더나 파일 목록을 가져옵니다.
  const onClickFolder = (id) => {
    const temp = [...prevFolderId];
    temp.push(currentFolderId); // 현재 폴더를 이전 폴더 목록에 추가
    setPrevFolderId(temp);
    setCurrentFolderId(id); // 선택한 폴더 ID로 업데이트
    getSubLists(id, ""); // 선택한 폴더의 하위 목록 가져오기
  };

  // 새 폴더 생성 모달을 토글합니다.
  const onClickCreateFolder = () => {
    setFolderNameModal((prev) => !prev);
  };

  // 폴더 생성 후 스토어에 저장하고 제목을 초기화합니다.
  const onSubmitCreateFolder = (folderName) => {
    if (currentFolderId === 0) postFolder(0, folderName, "MAIN", userInfo); // 루트 폴더인 경우
    else postFolder(currentFolderId, folderName, "SUB", userInfo); // 서브 폴더인 경우
    setFolderTitle(""); // 폴더 제목 초기화
  };

  // 파일을 선택하여 현재 폴더에 업로드합니다.
  const onSelectFile = (e) => {
    e.preventDefault();
    e.persist();
    file.current = e.target.files[0]; // 선택한 파일 참조
    postFile(currentFolderId, file.current, userInfo); // 파일 업로드
    setKey(Date.now()); // 파일 input의 고유 key를 갱신해 파일 선택 초기화
  };

  // 상위 폴더로 이동하여 경로를 업데이트합니다.
  const onClickUpFolder = () => {
    const temp = [...prevFolderId];
    setCurrentFolderId(prevFolderId.at(-1)); // 상위 폴더 ID로 이동
    const pos = currentPath.lastIndexOf("/");
    const tempStr = currentPath.substring(0, pos); // 상위 경로 설정
    setCurrentPath(tempStr);
    if (temp.length > 1) {
      getSubLists(temp.at(-1), ""); // 상위 폴더의 하위 목록 가져오기
      temp.pop();
      setPrevFolderId(temp);
    }
  };

  return (
    <>
      <main className="width_content archive">
        {/* 상단 검색 헤더 */}
        <BoardCommonHead
          searchKeyword={searchKeyword}
          setSeraching={setSeraching}
          modal={2}
          placeholder="자료실 검색"
        />

        {/* 현재 경로 표시 */}
        <div className={styles.path_nav}>
          <p>{currentPath}</p>
        </div>

        {/* 상단 버튼 (상위 폴더 이동, 폴더 생성, 파일 업로드 등) */}
        <ArchiveUpperButtons
          authority={userInfo.authority}
          onClickUpFolder={onClickUpFolder}
          currentFolderId={currentFolderId}
          onClickCreateFolder={onClickCreateFolder}
          file={file}
          onSelectFile={onSelectFile}
          key={shortid.generate()}
        />

        {/* 하위 폴더 및 파일 목록 표시 */}
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
            // 폴더와 파일이 없을 때 표시
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

        {/* 폴더 생성 모달 */}
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
