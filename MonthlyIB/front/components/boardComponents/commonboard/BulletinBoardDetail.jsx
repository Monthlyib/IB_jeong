"use client";
import { useDispatch, useSelector } from "react-redux";
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
import { useCallback, useEffect, useState } from "react";
import { bulletinBoardActions } from "../../../reducers/bulletinboard";
import { useRouter } from "next/router";
import Link from "next/link";

const BulletinBoardDetail = ({ pageId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { User } = useSelector((state) => state.user);
  const { getBulletinBoardDetailDone } = useSelector(
    (state) => state.bulletinBoard
  );
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (getBulletinBoardDetailDone === false) {
      dispatch(bulletinBoardActions.getBulletinBoardDetailRequest({ pageId }));
    }
  }, [getBulletinBoardDetailDone]);

  const { bulletinBoardDetail } = useSelector((state) => state.bulletinBoard);
  const onClickDelete = useCallback(() => {
    dispatch(bulletinBoardActions.deleteBulletinBoardRequest({ num: pageId }));
    router.push("/board/bulletinboard");
  }, []);

  const onClickEdit = useCallback(() => {
    router.push(
      {
        pathname: "/board/bulletinboard/write",
        query: {
          edit: true,
          prevTitle: bulletinBoardDetail.title,
          prevContent: bulletinBoardDetail.body,
          pageId,
        },
      },
      "/board/bulletinboard/write"
    );
  }, [getBulletinBoardDetailDone]);

  return (
    <>
      {bulletinBoardDetail.title !== undefined && (
        <main className="width_content">
          <div className={styles.read_wrap}>
            <div className={styles.read_cont}>
              <div className={styles.read_left}>
                <Link
                  href="/board/bulletinboard/"
                  className={`${styles.read_btn} ${styles.list}`}
                >
                  <FontAwesomeIcon icon={faBars} />
                </Link>
              </div>
              <div className={styles.read_center}>
                <div className={styles.read_header}>
                  <h3>{bulletinBoardDetail.title}</h3>
                  <div className={styles.read_info_label}>
                    <span>{bulletinBoardDetail.owner_name}</span>
                    <b>·</b>
                    <span>{bulletinBoardDetail.time}</span>
                    <b>·</b>
                    <span>{bulletinBoardDetail.views}</span>
                  </div>
                </div>

                <div className={styles.read_content}>
                  {/* <div className={styles.file_wrap}>
                  <ul>
                    {bulletinBoardDetail.Files.length > 0 &&
                      bulletinBoardDetail.Files.map((f) => (
                        <li key={shortId.generate()}>
                          <a href={f.src} download>
                            <FontAwesomeIcon icon={faFile} />
                            <span>{f.filename}</span>
                          </a>
                        </li>
                      ))}
                  </ul>
                </div> */}

                  <div className={styles.title}>
                    <p>
                      {/* <img
                      src={bulletinBoards[currentIndex].Image.src}
                      alt="잡지 이미지"
                    /> */}
                    </p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: bulletinBoardDetail.body,
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
                    {User.num && <BulletinBoardCommentsPost pageId={pageId} />}
                  </div>

                  <div className={styles.comment_filter}>
                    <h5>
                      댓글 <span>{bulletinBoardDetail.comments.length}</span>개
                    </h5>
                    <div className={styles.comment_select}>
                      <span className="active">최신순</span>
                      <span>좋아요순</span>
                    </div>
                  </div>

                  <div className={styles.comment_cont}>
                    <BulletinBoardCommentsItems
                      bulletinBoardComments={bulletinBoardDetail.comments}
                      currentPage={currentPage}
                      numShowContents={5}
                      onPageChange={handlePageChange}
                      pageId={pageId}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.read_right}>
                {User.num === bulletinBoardDetail.owner && (
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
