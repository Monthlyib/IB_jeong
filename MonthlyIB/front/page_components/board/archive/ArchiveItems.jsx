import styles from "../BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFile,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { archiveActions } from "../../../reducers/archive";
import { useCallback } from "react";

const ArchiveItems = ({ list, onClickFolder, setCurrentPath, currentPath }) => {
  const dispatch = useDispatch();
  const { downloadURL } = useSelector((state) => state.archive);

  const onClickDelete = useCallback(() => {
    dispatch(
      archiveActions.deleteArchiveRequest({ currentPath: currentPath + list })
    );
  }, []);

  if (list == undefined) {
    return (
      <div className={styles.ib_archive_no}>
        <p>자료가 없습니다.</p>
      </div>
    );
  } else if (list.split(".").length > 1) {
    return (
      <>
        <div className={styles.ib_archive_list} datatype="file">
          <div className={styles.ib_archive_box}>
            <div
              className={styles.ib_archive_info}
              onClick={() => {
                console.log("hhhhhhh");
                dispatch(archiveActions.downloadArchiveRequest(list));
                const new_window = window.open(downloadURL);
                setTimeout(() => {
                  new_window.close();
                }, 100);
              }}
            >
              <FontAwesomeIcon icon={faFile} />
              <span>{list}</span>
            </div>

            <div className={styles.options}>
              <button type="button" id="delete" onClick={onClickDelete}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={styles.ib_archive_list}
        datatype="folder"
        onClick={() => {
          onClickFolder();
          setCurrentPath((prev) => prev + list + "/");
        }}
      >
        <div className={styles.ib_archive_box}>
          <div className={styles.ib_archive_info}>
            <FontAwesomeIcon icon={faFolder} />
            <span>{list}</span>
          </div>

          <div className={styles.options}>
            <button type="button" id="delete">
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArchiveItems;
