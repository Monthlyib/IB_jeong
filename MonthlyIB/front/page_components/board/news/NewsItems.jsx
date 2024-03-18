import styles from "../BoardCommon.module.css";
import _ from "lodash";
import Paginatation from "../../Paginatation";
import Link from "next/link";

const NewsItems = ({ newsContents, currentPage, numShowContents, onPageChange }) => {

    const paginate = (items, pageNum) => {
        const startIndex = (pageNum - 1) * numShowContents;
        return _(items).slice(startIndex).take(numShowContents).value();
    }

    const paginatedPage = paginate(newsContents, currentPage);
    return (
        <>
            {
                newsContents.length > 0 ?
                    paginatedPage.map((content) => (
                        <div className={styles.board_item} key={content.id}>
                            <Link href={`/board/${content.id}`}>
                                <div className={styles.board_cont}>
                                    <p>{content.title}</p>
                                    <span>{content.content}</span>
                                </div>
                                <div>
                                    <span>{content.User.userName}</span>
                                    <b> · </b>
                                    <span>{content.Date}</span>
                                    <b> · </b>
                                    <span>{content.View}</span>
                                </div>
                            </Link>
                        </div>
                    ))
                    :
                    <div className={styles.course_no}>
                        <p>게시글이 없습니다.</p>
                    </div>
            }
            {
                newsContents.length > 0 &&
                <Paginatation
                    contents={newsContents}
                    currentPage={currentPage}
                    numShowContents={numShowContents}
                    onPageChange={onPageChange} />
            }

        </>

    );
};

export default NewsItems;