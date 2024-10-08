import styles from "@/components/boardComponents/BoardCommon.module.css";

const ArchiveFolderModal = ({
  closeRef,
  type = "post",
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
              <div className={styles.tit}>
                {type === "post" ? "폴더추가" : "폴더 이름수정"}
              </div>
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
                onSubmitCreateFolder(title);
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
