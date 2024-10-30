"use client";
import styles from "@/components/boardComponents/BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faFolderPlus,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const ArchiveUpperButtons = ({
  authority,
  onClickUpFolder,
  currentFolderId,
  onClickCreateFolder,
  file,
  onSelectFile,
  key,
}) => {
  const handleButtonClick = () => {
    if (file.current) {
      file.current.click();
    } else {
      console.error("File input ref is not assigned");
    }
  };

  return (
    <div className={styles.right_btn} style={{ marginBottom: "3rem" }}>
      {/* 상위 폴더 버튼은 모두가 접근 가능 */}
      <button
        className={
          currentFolderId > 0
            ? styles.btn_write_back
            : styles.btn_write_back_disabled
        }
        onClick={onClickUpFolder}
        disabled={currentFolderId > 0 ? false : true}
      >
        <FontAwesomeIcon icon={faArrowUpFromBracket} />
        <span>상위폴더</span>
      </button>

      {/* ADMIN일 때만 폴더 추가와 파일 추가 버튼 표시 */}
      {authority === "ADMIN" && (
        <>
          <button className={styles.btn_write_back} onClick={onClickCreateFolder}>
            <FontAwesomeIcon icon={faFolderPlus} />
            <span>폴더추가</span>
          </button>
          <button className={styles.btn_write_back} onClick={handleButtonClick}>
            <FontAwesomeIcon icon={faFileCirclePlus} />
            <input key={key} type="file" onChange={onSelectFile} ref={file} />
            <span>파일추가</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ArchiveUpperButtons;
