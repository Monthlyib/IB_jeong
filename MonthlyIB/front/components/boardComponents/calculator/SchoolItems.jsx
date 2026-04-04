import styles from "../BoardCommon.module.css";
import _ from "lodash";
import Pagination from "../../layoutComponents/Paginatation";

const SchoolItems = ({
  schools,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const paginate = (items, pageNum) => {
    if (items?.length > numShowContents) {
      const startIndex = (pageNum - 1) * numShowContents;
      return _(items).slice(startIndex).take(numShowContents).value();
    } else {
      return items;
    }
  };
  const paginatedPage = paginate(schools, currentPage);
  return (
    <>
      {schools?.length > 0 ? (
        paginatedPage.map((school) => (
          <div className={styles.school_item} key={school.id || school.name}>
            <div className={styles.school_left}>
              <figure className={styles.school_logo}>
                <img src={school?.img} alt="University Logo" />
              </figure>
              <p className={styles.school_tit}>{school?.name}</p>
            </div>
            <div className={styles.school_right}>
              <div className={styles.school_info}>
                <span>IB Score</span>
                <b>{school?.ibScore}</b>
              </div>
              <div className={styles.school_info}>
                <span>World Ranking</span>
                <b>{school?.rank}</b>
              </div>
              <div className={styles.school_info}>
                <span>Tuition</span>
                <b>{school?.tuition}</b>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.no_school}>
          <p>추천학교가 없습니다.</p>
        </div>
      )}
      {schools?.length > 0 && (
        <Pagination
          contents={schools}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default SchoolItems;
