import styles from "./MyPage.module.css";
import _ from "lodash";
import Pagination from "../Paginatation";
import Link from "next/link";

const MyPageQuestionListItems = ({ questionContents, currentPage, numShowContents, onPageChange }) => {
    const paginate = (items, pageNum) => {
        const startIndex = (pageNum - 1) * numShowContents;
        return _(items).slice(startIndex).take(numShowContents).value();
    }
    const paginatedPage = paginate(questionContents, currentPage);
    return (
        <>
            {
                questionContents.length > 0 ?
                    paginatedPage.map((content) => (
                        <div className={`${styles.question_item} 
                        ${content.status === "답변완료" ? styles.reserve : styles.wait}`} key={content.id}>
                            <Link href={`/question/${content.id}`}>
                                <div className={styles.q_flex_top}>
                                    <p>{content.content}</p>
                                </div>
                                <div className={styles.q_flex_bottom}>
                                    <span className={styles.q_class}>{content.subject}</span>
                                    <span className={styles.q_ceiling}>{content.status}</span>
                                </div>
                            </Link>
                        </div>
                    ))
                    : <div className={styles.question_no_wrap}>
                        <div className={styles.question_no}>
                            <p>게시글이 없습니다.</p>
                        </div>
                    </div>

            }
            {
                questionContents.length > 0 &&
                <Pagination contents={questionContents} currentPage={currentPage} numShowContents={numShowContents} onPageChange={onPageChange} />
            }

        </>
    );
};

export default MyPageQuestionListItems;