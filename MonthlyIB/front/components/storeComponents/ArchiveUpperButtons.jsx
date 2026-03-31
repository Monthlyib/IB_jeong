"use client";
import styles from "@/components/storeComponents/ArchiveComponents.module.css";
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
    <div className={styles.toolbarActions}>
      <button
        className={
          currentFolderId > 0
            ? styles.archiveActionButton
            : `${styles.archiveActionButton} ${styles.isDisabled}`
        }
        onClick={onClickUpFolder}
        disabled={currentFolderId > 0 ? false : true}
      >
        <FontAwesomeIcon icon={faArrowUpFromBracket} />
        <span>상위폴더</span>
      </button>

      {authority === "ADMIN" && (
        <>
          <button className={styles.archiveActionButton} onClick={onClickCreateFolder}>
            <FontAwesomeIcon icon={faFolderPlus} />
            <span>폴더추가</span>
          </button>
          <button className={styles.archiveActionButton} onClick={handleButtonClick}>
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
