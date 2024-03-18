import styles from "./BoardCommon.module.css";
import _ from "lodash";
import Pagination from "./Paginatation";
import Link from "next/link";
import shortid from "shortid";

const GuideItems = ({ guideContents, currentPage, numShowContents, onPageChange }) => {

    const paginate = (items, pageNum) => {
        const startIndex = (pageNum - 1) * numShowContents;
        return _(items).slice(startIndex).take(numShowContents).value();
    }

    const paginatedPage = paginate(guideContents, currentPage);
    return (
        <>
            {
                guideContents.length > 0 ?
                    paginatedPage.map((content) => (
                        <div className={styles.ib_item} key={shortid.generate()}>
                            <Link href={`/board/guide/${content.id}`}>
                                <figure>
                                    <img src={content.Image.src} alt="잡지 이미지" width={353} height={400} />
                                </figure>
                                <span className={styles.ib_txt}>{content.title}</span>
                            </Link>
                        </div>
                    ))
                    : <div className={styles.archive_no}>
                        <p>등록된 글이 없습니다.</p>
                    </div>
            }
            <Pagination contents={guideContents} currentPage={currentPage} numShowContents={numShowContents} onPageChange={onPageChange} />
        </>
    );
};

export default GuideItems;