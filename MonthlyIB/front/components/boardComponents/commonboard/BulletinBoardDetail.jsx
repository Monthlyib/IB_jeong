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
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import shortid from "shortid";
import { boardDeleteItem } from "@/apis/boardAPI";
import { useBoardStore } from "@/store/board";
import { useUserStore } from "@/store/user";

const BulletinBoardDetail = (pageId) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("currentPage");
  const { userInfo } = useUserStore();
  const [ReplyCurrentPage, setReplyCurrentPage] = useState(1);
  const { bulletinBoardDetail, boardList, getBoardList, updateBoardComment } =
    useBoardStore();
  const getBoardDetail = useBoardStore((state) => state.getBoardDetail);
  const currentIndex = boardList.findIndex(
    (v) => v.boardId === parseInt(pageId?.pageId)
  );
  const [filteredBoardDetail, setFilteredBoardDetail] = useState({});

  const [menuClicked, setMenuClicked] = useState({
    recent: true,
    likes: false,
  });

  useEffect(() => {
    if (menuClicked.recent) {
      const temp = { ...bulletinBoardDetail };
      const test = temp.reply?.data.sort((a, b) => {
        return new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime();
      });
      setFilteredBoardDetail({ ...temp, reply: { data: test } });
    } else if (menuClicked.likes) {
      const temp = { ...bulletinBoardDetail };
      const test = temp.reply?.data.sort((a, b) => {
        return b.voterCount - a.voterCount;
      });
      setFilteredBoardDetail({ ...temp, reply: { data: test } });
    }
  }, [bulletinBoardDetail?.reply?.data]);

  const onClickRecent = () => {
    setMenuClicked({ recent: true, likes: false });
    const temp = { ...bulletinBoardDetail };
    const test = temp.reply.data.sort((a, b) => {
      return new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime();
    });
    setFilteredBoardDetail({ ...temp, reply: { data: test } });
  };

  const onClickLikes = () => {
    setMenuClicked({ recent: false, likes: true });
    const temp = { ...bulletinBoardDetail };
    const test = temp.reply.data.sort((a, b) => {
      return b.voterCount - a.voterCount;
    });
    setFilteredBoardDetail({ ...temp, reply: { data: test } });
  };

  const handlePageChange = (page) => {
    setReplyCurrentPage(page);
  };

  useEffect(() => {
    getBoardDetail(pageId?.pageId, ReplyCurrentPage);
    getBoardList(currentPage, "");
  }, []);
  const onClickDelete = async () => {
    boardDeleteItem(pageId?.pageId, userInfo);
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
                  <Link
                    href={
                      boardList[currentIndex - 1]?.boardId !== undefined
                        ? `/board/free/${
                            boardList[currentIndex - 1]?.boardId
                          }?currentPage=${currentPage}`
                        : "#"
                    }
                    className={
                      boardList[currentIndex - 1]?.boardId === undefined
                        ? styles.disabled
                        : ""
                    }
                  >
                    이전
                  </Link>
                  <Link
                    href={
                      boardList[currentIndex + 1]?.boardId !== undefined
                        ? `/board/free/${
                            boardList[currentIndex + 1]?.boardId
                          }?currentPage=${currentPage}`
                        : "#"
                    }
                    className={
                      boardList[currentIndex + 1]?.boardId === undefined
                        ? styles.disabled
                        : ""
                    }
                  >
                    다음
                  </Link>
                </div>

                <div className={styles.comment_wrap}>
                  <div className={styles.comment_content_wrap}>
                    <h4>댓글 입력</h4>
                    {userInfo?.userStatus === "ACTIVE" && (
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
                      bulletinBoardComments={filteredBoardDetail?.reply.data}
                      currentPage={currentPage}
                      numShowContents={5}
                      onPageChange={handlePageChange}
                      pageId={pageId?.pageId}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.read_right}>
                {userInfo?.username === bulletinBoardDetail.authorUsername && (
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
