import styles from "./IbComponents.module.css";
import _ from "lodash";
import Pagination from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import shortid from "shortid";
import Image from "next/image";

import { monthlyIBDeleteItem } from "@/api/monthlyIbAPI";

const IbItems = ({
  IBContents,
  currentPage,
  numShowContents,
  onPageChange,
  setIbpost,
}) => {
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(IBContents, currentPage);
  const { data: session } = useSession();
  const onClickDelete = async (num) => {
    monthlyIBDeleteItem(num, session);
    const temp = [...IBContents];
    setIbpost([...temp.filter((v) => v.monthlyIbId !== num)]);
  };

  // const onClickPost = useCallback((num) => {
  //   dispatch(ibPostActions.getIBPdfRequest({ num }));
  // }, []);
  return (
    <>
      {IBContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.ib_item} key={shortid.generate()}>
            {session?.authority === "ADMIN" && (
              <button
                onClick={() => {
                  onClickDelete(content.monthlyIbId);
                }}
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            )}

            <a
              onClick={() => {
                onClickPost(content.num);
              }}
            >
              <figure>
                <Image
                  src={content.monthlyIbThumbnailUrl}
                  alt="잡지 이미지"
                  width="353"
                  height="400"
                />
              </figure>
              <span className={styles.ib_txt}>{content.title}</span>
            </a>
          </div>
        ))
      ) : (
        <div className={styles.course_no}>
          <p>등록된 글이 없습니다.</p>
        </div>
      )}
      {IBContents.length > 0 && (
        <Pagination
          contents={IBContents}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default IbItems;
