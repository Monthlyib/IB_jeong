"use client";
import styles from "@/components/boardComponents/BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faFolderPlus,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const ArchiveUpperButtons = ({
  onClickUpFolder,
  currentFolderId,
  onClickCreateFolder,
  file,
  onSelectFile,
}) => {
  return (
    <>
      <div className={styles.right_btn} style={{ marginBottom: "3rem" }}>
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

        <button className={styles.btn_write_back} onClick={onClickCreateFolder}>
          <FontAwesomeIcon icon={faFolderPlus} />
          <span>폴더추가</span>
        </button>
        <button
          className={styles.btn_write_back}
          onClick={() => file.current.click()}
        >
          <FontAwesomeIcon icon={faFileCirclePlus} />
          <input type="file" onChange={onSelectFile} ref={file} />
          <span>파일추가</span>
        </button>
      </div>
    </>
  );
};

export default ArchiveUpperButtons;
