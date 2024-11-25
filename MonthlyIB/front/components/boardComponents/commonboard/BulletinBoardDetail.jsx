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
import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import shortid from "shortid";
import { boardDeleteItem } from "@/apis/boardAPI";
import { useBoardStore } from "@/store/board";
import { useUserInfo } from "@/store/user";

const BulletinBoardDetail = (pageId) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("currentPage");
  const { userInfo } = useUserInfo();
  const [ReplyCurrentPage, setReplyCurrentPage] = useState(1);
  const { bulletinBoardDetail, boardList, getBoardList, PageInfo, deleteBoardDetail } = useBoardStore();
  const getBoardDetail = useBoardStore((state) => state.getBoardDetail);
  const currentIndex = boardList?.findIndex(
    (v) => v.boardId === parseInt(pageId?.pageId)
  );
  const [filteredBoardDetail, setFilteredBoardDetail] = useState({});

  const [menuClicked, setMenuClicked] = useState({
    recent: true,
    likes: false,
  });

  const currentPageInt = parseInt(currentPage);
  
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
  }, [bulletinBoardDetail?.reply?.data, menuClicked]);

  const onClickRecent = () => {
    setMenuClicked({ recent: true, likes: false });
  };

  const onClickLikes = () => {
    setMenuClicked({ recent: false, likes: true });
  };

  const handlePageChange = (page) => {
    setReplyCurrentPage(page);
  };

  useEffect(() => {
    getBoardDetail(pageId?.pageId, ReplyCurrentPage);
    getBoardList(currentPage < 1 ? 1 : currentPage, "");
  }, []);

  const onClickDelete = async () => {
    deleteBoardDetail(pageId?.pageId, userInfo);
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
                    <ul style={{ listStyle: "none" }}>
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
                  {/* 이전 버튼 */}
                  <Link
                    href="#"
                    onClick={async (e) => {
                      e.preventDefault();

                      if (currentIndex === 0 && currentPageInt > 1) {
                        // 이전 페이지로 이동하기 위해 데이터 가져오기
                        await getBoardList(currentPageInt - 1, ""); // 상태 업데이트 대기
                        const updatedBoardList = useBoardStore.getState().boardList; // 최신 상태 가져오기
                        router.push(
                          `/board/free/${updatedBoardList[updatedBoardList.length - 1]?.boardId}?currentPage=${currentPageInt - 1
                          }`
                        );
                      } else if (boardList[currentIndex - 1]?.boardId !== undefined) {
                        // 현재 페이지 내에서 이동
                        router.push(
                          `/board/free/${boardList[currentIndex - 1]?.boardId}?currentPage=${currentPageInt}`
                        );
                      }
                    }}
                    className={
                      currentIndex === 0 && currentPageInt === 1
                        ? styles.disabled
                        : ""
                    }
                  >
                    이전
                  </Link>

                  {/* 다음 버튼 */}
                  <Link
                    href="#"
                    onClick={async (e) => {
                      e.preventDefault();

                      if (
                        currentIndex === boardList.length - 1 &&
                        currentPageInt < PageInfo.totalPages
                      ) {
                        // 다음 페이지로 이동하기 위해 데이터 가져오기
                        await getBoardList(currentPageInt + 1, ""); // 상태 업데이트 대기
                        const updatedBoardList = useBoardStore.getState().boardList; // 최신 상태 가져오기
                        router.push(
                          `/board/free/${updatedBoardList[0]?.boardId}?currentPage=${currentPageInt + 1
                          }`
                        );
                      } else if (boardList[currentIndex + 1]?.boardId !== undefined) {
                        // 현재 페이지 내에서 이동
                        router.push(
                          `/board/free/${boardList[currentIndex + 1]?.boardId
                          }?currentPage=${currentPageInt}`
                        );
                      }
                    }}
                    className={
                      currentIndex === boardList.length - 1 &&
                        currentPageInt === PageInfo.totalPages
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
                      bulletinBoardComments={filteredBoardDetail?.reply?.data}
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
