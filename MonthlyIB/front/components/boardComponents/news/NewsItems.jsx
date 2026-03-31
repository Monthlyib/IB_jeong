import styles from "../BoardCommon.module.css";
import Pagination from "../Pagination";
import Link from "next/link";

const NewsItems = ({
  newsContents,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <>
      {newsContents.length > 0 ? (
        newsContents.map((content) => (
          <div className={styles.board_item} key={content.newsId}>
            <Link href={`/board/${content.newsId}?currentPage=${currentPage}`}>
              <div className={styles.board_cont}>
                <p>{content.title}</p>
                <span
                  dangerouslySetInnerHTML={{
                    __html: content.content,
                  }}
                ></span>
              </div>

              <div className={styles.board_txt}>
                <div className={styles.boardMetaGroup}>
                  <span>{content.authorUsername}</span>
                  <b>·</b>
                  <span>{content.createAt}</span>
                </div>
                <div className={styles.boardMetaStat}>
                  <span>조회수 {content.viewCount}</span>
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className={styles.course_no}>
          <p>게시글이 없습니다.</p>
        </div>
      )}
      {newsContents.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default NewsItems;
