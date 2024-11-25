import styles from "../BoardCommon.module.css";
import _ from "lodash";
import Pagination from "../Pagination";
import Link from "next/link";
import shortid from "shortid";
import { useUserInfo } from "@/store/user";

const BulletinBoardItems = ({
  bulletinBoardContents,
  currentPage,
  numShowContents,
  totalPage,
  onPageChange,
}) => {

  const { userInfo } = useUserInfo();


  return (
    <>
      {bulletinBoardContents?.length > 0 ? (
        bulletinBoardContents.map((content) => (
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default BulletinBoardItems;
