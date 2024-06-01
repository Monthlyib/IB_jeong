import styles from "./MyPage.module.css";
import _ from "lodash";
import Pagination from "@/components/layoutComponents/Paginatation";
import Link from "next/link";

const MyPageArchiveListItems = ({
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
          <div className={styles.board_item} key={content.id}>
            <Link href={`/board/bulletinboard/${content.id}`}>
              <div className={styles.board_cont}>
                <p>{content.title}</p>
                <span>{content.content}</span>
              </div>
              <div className={styles.board_txt}>
                <span>{content.User.userName}</span>
                <b> · </b>
                <span>{content.Date}</span>
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
        <Pagination
          contents={bulletinBoardContents}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default MyPageArchiveListItems;
