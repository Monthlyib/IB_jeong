import styles from "../BoardCommon.module.css";
import _ from "lodash";
import Pagination from "../Pagination";
import Link from "next/link";
import { useUserInfo } from "@/store/user";
import shortid from "shortid";
import { useEffect } from "react";

const NewsItems = ({
  newsContents,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { userInfo } = useUserInfo();



  return (
    <>
      {newsContents.length > 0 ? (
        newsContents.map((content) => (
          <div className={styles.board_item} key={shortid.generate()}>
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
