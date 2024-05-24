"use client";
import styles from "../BoardCommon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faPenAlt,
  faTrashAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import shortid from "shortid";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useNewstore } from "@/store/news";
import { newsDeleteItem } from "@/apis/newsAPI";

const NewsDetail = (pageId) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { newsDetail, getNewsDetail } = useNewstore();

  const onClickDelete = useCallback(() => {
    newsDeleteItem(pageId?.pageId, session);
    router.push("/board/");
  }, []);

  useEffect(() => {
    getNewsDetail(pageId?.pageId, session);
  }, []);

  const onClickEdit = useCallback(() => {
    router.push(`/board/newswrite?type=revise&newsId=${pageId.pageId}`);
  }, []);
  return (
    <>
      <main className="width_content">
        <div className={styles.read_wrap}>
          <div className={styles.read_cont}>
            <div className={styles.read_left}>
              <Link
                href="/board/"
                className={`${styles.read_btn} ${styles.list}`}
              >
                <FontAwesomeIcon icon={faBars} />
              </Link>
            </div>
            <div className={styles.read_center}>
              <div className={styles.read_header}>
                <h3>{newsDetail.title}</h3>
                <div className={styles.read_info_label}>
                  <span>{newsDetail.authorUsername}</span>
                  <b>·</b>
                  <span>{newsDetail.createAt}</span>
                  <b>·</b>
                  <span>{newsDetail.viewCount}</span>
                </div>
              </div>

              <div className={styles.read_content}>
                <div className={styles.file_wrap}>
                  <ul>
                    {newsDetail?.files?.length > 0 &&
                      newsDetail.files.map((f) => (
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
                      __html: newsDetail.content,
                    }}
                  ></p>
                </div>
              </div>

              <div className={styles.read_btn_area}>
                <button className={styles.prev}>이전</button>
                <button className={styles.next}>다음</button>
              </div>
            </div>
            <div className={styles.read_right}>
              {session?.username === newsDetail.authorUsername && (
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
    </>
  );
};

export default NewsDetail;
