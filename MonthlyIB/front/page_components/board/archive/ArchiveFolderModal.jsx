import styles from "../BoardCommon.module.css";

const ArchiveFolderModal = ({
  closeRef,
  title,
  setTitle,
  setModal,
  onSubmitCreateFolder,
}) => {
  return (
    <>
      <div className={styles.md}>
        <div
          className={styles.md_box_flex}
          ref={closeRef}
          onClick={(e) => closeRef.current === e.target && setModal(false)}
        >
          <div className={styles.md_box}>
            <div className={styles.md_top}>
              <div className={styles.tit}>폴더추가</div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="폴더명을 적어주세요."
              />
            </div>
            <button
              type="button"
              className={styles.md_btn}
              onClick={() => {
                setModal(false);
                onSubmitCreateFolder();
              }}
            >
              확인
            </button>
          </div>
        </div>
        <div className={styles.md_dim}></div>
      </div>
    </>
  );
};

export default ArchiveFolderModal;
