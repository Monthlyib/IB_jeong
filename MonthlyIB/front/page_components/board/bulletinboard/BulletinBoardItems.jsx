import styles from "../BoardCommon.module.css";
import _ from "lodash";
import Paginatation from "../../Paginatation";
import Link from "next/link";

const BulletinBoardItems = ({
  bulletinBoardContents,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(bulletinBoardContents, currentPage);
  return (
    <>
      {bulletinBoardContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.board_item} key={content.num}>
            <Link href={`/board/bulletinboard/${content.num}`}>
              <div className={styles.board_cont}>
                <p>{content.title}</p>
                <span>{content.preview}</span>
              </div>
              <div>
                <span>{content.owner_name}</span>
                <b> · </b>
                <span>{content.time}</span>
                <b> · </b>
                <span>조회수 {content.views}</span>
                <b> · </b>
                {/* <span>댓글 {content.Comments.length}</span> */}
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className={styles.course_no}>
          <p>게시글이 없습니다.</p>
        </div>
      )}
      {bulletinBoardContents.length > 0 && (
        <Paginatation
          contents={bulletinBoardContents}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default BulletinBoardItems;
