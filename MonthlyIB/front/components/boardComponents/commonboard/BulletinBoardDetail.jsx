"use client";
import styles from "../BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faPenAlt,
  faTrashAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import BulletinBoardCommentsItems from "./BulletinBoardCommentsItems";
import BulletinBoardCommentsPost from "./BulletinBoardCommentsPost";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import shortid from "shortid";
import { boardDeleteItem } from "@/api/boardAPI";
import { useBoardStore } from "@/store/board";

const BulletinBoardDetail = (pageId) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const { bulletinBoardDetail } = useBoardStore();
  const getBoardDetail = useBoardStore((state) => state.getBoardDetail);
  const [menuClicked, setMenuClicked] = useState({
    recent: true,
    likes: false,
  });

  const onClickRecent = () => {
    setMenuClicked({ recent: true, likes: false });
  };

  const onClickLikes = () => {
    setMenuClicked({ recent: false, likes: true });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getBoardDetail(pageId?.pageId, currentPage);
  }, []);
  const onClickDelete = async () => {
    boardDeleteItem(pageId?.pageId, session);
    router.push("/board/free");
  };

  const onClickEdit = () => {
    router.push(`/board/free/write?type=revise&boardId=${pageId.pageId}`);
  };

  return (
    <>
      {bulletinBoardDetail?.title !== undefined && (
        <main className="width_content">
          <div className={styles.read_wrap}>
            <div className={styles.read_cont}>
              <div className={styles.read_left}>
                <Link
                  href="/board/free/"
                  className={`${styles.read_btn} ${styles.list}`}
                >
                  <FontAwesomeIcon icon={faBars} />
                </Link>
              </div>
              <div className={styles.read_center}>
                <div className={styles.read_header}>
                  <h3>{bulletinBoardDetail.title}</h3>
                  <div className={styles.read_info_label}>
                    <span>{bulletinBoardDetail.authorNickName}</span>
                    <b>·</b>
                    <span>{bulletinBoardDetail.createAt}</span>
                    <b>·</b>
                    <span>{bulletinBoardDetail.viewCount}</span>
                  </div>
                </div>

                <div className={styles.read_content}>
                  <div className={styles.file_wrap}>
                    <ul>
                      {bulletinBoardDetail.files.length > 0 &&
                        bulletinBoardDetail.files.map((f) => (
                          <li key={shortid.generate()}>
                            <a href={f.fileUrl} download>
                              <FontAwesomeIcon icon={faFile} />
                              <span>{f.fileName}</span>
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className={styles.title}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: bulletinBoardDetail.content,
                      }}
                    ></p>
                  </div>
                </div>

                <div className={styles.read_btn_area}>
                  <button className={styles.prev}>이전</button>
                  <button className={styles.next}>다음</button>
                </div>

                <div className={styles.comment_wrap}>
                  <div className={styles.comment_content_wrap}>
                    <h4>댓글 입력</h4>
                    {session?.userStatus === "ACTIVE" && (
                      <BulletinBoardCommentsPost pageId={pageId?.pageId} />
                    )}
                  </div>

                  <div className={styles.comment_filter}>
                    <h5>
                      댓글 <span>{bulletinBoardDetail?.reply.data.length}</span>
                      개
                    </h5>
                    <div className={styles.comment_select}>
                      <button
                        className={
                          menuClicked.recent === true
                            ? styles.active
                            : undefined
                        }
                        onClick={onClickRecent}
                      >
                        최신순
                      </button>
                      <button
                        className={
                          menuClicked.likes === true ? styles.active : undefined
                        }
                        onClick={onClickLikes}
                      >
                        좋아요순
                      </button>
                    </div>
                  </div>

                  <div className={styles.comment_cont}>
                    <BulletinBoardCommentsItems
                      bulletinBoardComments={bulletinBoardDetail?.reply.data}
                      currentPage={currentPage}
                      numShowContents={5}
                      onPageChange={handlePageChange}
                      pageId={pageId?.pageId}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.read_right}>
                {session?.username === bulletinBoardDetail.authorUsername && (
                  <div className={styles.auth_btn_cont}>
                    <button
                      className={`${styles.read_btn} ${styles.update}`}
                      onClick={onClickEdit}
                    >
                      <FontAwesomeIcon icon={faPenAlt} />
                    </button>
                    <button
                      className={`${styles.read_btn} ${styles.delete}`}
                      onClick={onClickDelete}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default BulletinBoardDetail;
