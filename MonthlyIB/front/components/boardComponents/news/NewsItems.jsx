import styles from "../BoardCommon.module.css";
import _ from "lodash";
import Paginatation from "../../layoutComponents/Paginatation";
import Link from "next/link";
import { useUserStore } from "@/store/user";

const NewsItems = ({
  newsContents,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const { userInfo } = useUserStore();
  const paginatedPage = paginate(newsContents, currentPage);
  return (
    <>
      {newsContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.board_item} key={content.newsId}>
            <Link
              href={`/board/${content.newsId}?currentPage=${currentPage}&userId=${userInfo.userId}`}
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
                <span>{content.authorUsername}</span>
                <b> · </b>
                <span>{content.createAt}</span>
                <b> · </b>
                <span>{content.viewCount}</span>
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
        <Paginatation
          contents={newsContents}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default NewsItems;
