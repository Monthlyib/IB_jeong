import styles from "../BoardCommon.module.css";
import _ from "lodash";
import Paginatation from "../../layoutComponents/Paginatation";
import Link from "next/link";
import shortid from "shortid";

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
      {bulletinBoardContents?.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.board_item} key={shortid.generate()}>
            <Link
              href={`/board/free/${content.boardId}?currentPage=${currentPage}`}
            >
              <div className={styles.board_cont}>
                <p>{content.title}</p>
                <span
                  dangerouslySetInnerHTML={{
                    __html: content.content,
                  }}
                ></span>
              </div>
              <div>
                <span>{content.authorNickName}</span>
                <b> · </b>
                <span>{content.createAt.split("T")[0]} &nbsp;</span>
                <span>{content.createAt.split("T")[1]}</span>
                <b> · </b>
                <span>조회수 {content.viewCount}</span>
                <b> · </b>
                <span>댓글 {content?.replyCount}</span>
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
