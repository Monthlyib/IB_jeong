"use client";
import styles from "@/components/boardComponents/BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFile,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";

const ArchiveItems = ({ folders, type, onClickFolder, setCurrentPath }) => {
  const onClickDelete = useCallback(() => {}, []);
  return (
    <>
      {type === "folders" &&
        folders.map((f) => (
          <div
            className={styles.ib_archive_list}
            datatype="folder"
            onClick={() => {
              onClickFolder(f.folderId);
              setCurrentPath((prev) => prev + " / " + f.name);
            }}
            key={f.folderId}
          >
            <div className={styles.ib_archive_box}>
              <div className={styles.ib_archive_info}>
                <FontAwesomeIcon icon={faFolder} />
                <span>{f.name}</span>
              </div>

              <div className={styles.options}>
                <button type="button" id="delete">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
          </div>
        ))}

      {type === "files" &&
        folders.map((f) => (
          <div
            className={styles.ib_archive_list}
            datatype="file"
            key={f.fileId}
          >
            <div className={styles.ib_archive_box}>
              <div className={styles.ib_archive_info}>
                <FontAwesomeIcon icon={faFile} />
                <span>{f.fileName}</span>
              </div>

              <div className={styles.options}>
                <button type="button" id="delete">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ArchiveItems;
