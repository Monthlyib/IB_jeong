import styles from "../BoardCommon.module.css";
import _ from "lodash";
import Pagination from "../../Paginatation";

const SchoolItems = ({ schoolList, schoolObj, currentPage, numShowContents, onPageChange }) => {
    const paginate = (items, pageNum) => {
        if (items.length > numShowContents) {
            const startIndex = (pageNum - 1) * numShowContents;
            return _(items).slice(startIndex).take(numShowContents).value();
        }
        else {
            return items
        }
    }
    const paginatedPage = paginate(schoolList, currentPage);
    return (
        <>
            {
                schoolList.length > 0 ?
                    paginatedPage.map((schoolName) => (
                        <div className={styles.school_item}>
                            <div className={styles.school_left}>
                                <figure className={styles.school_logo}>
                                    <img src={schoolObj[schoolName].img} alt="University Logo" />
                                </figure>
                                <p className={styles.school_tit}>{schoolObj[schoolName].name}</p>
                            </div>
                            <div className={styles.school_right}>
                                <div className={styles.school_info}>
                                    <span>IB Score</span>
                                    <b>{schoolObj[schoolName].IBScore}</b>
                                </div>
                                <div className={styles.school_info}>
                                    <span>World Ranking</span>
                                    <b>{schoolObj[schoolName].rank}</b>
                                </div>
                                <div className={styles.school_info}>
                                    <span>Tuition</span>
                                    <b>{schoolObj[schoolName].tuition}</b>
                                </div>
                            </div>
                        </div>
                    ))
                    : <div className={styles.no_school}>
                        <p>추천학교가 없습니다.</p>
                    </div>
            }
            {
                schoolList.length > 0 &&
                <Pagination contents={schoolList} currentPage={currentPage} numShowContents={numShowContents} onPageChange={onPageChange} />
            }

        </>
    );
};

export default SchoolItems;