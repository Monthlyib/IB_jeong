import styles from "./IbComponents.module.css";
import _ from "lodash";
import Pagination from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";
import { useSession } from "next-auth/react";

const IbItems = ({
  IBContents,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(IBContents, currentPage);
  const { data: session } = useSession();

  const onClickDelete = useCallback(async (num) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC.URL}/api/monthly-ib/${num}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  // const onClickPost = useCallback((num) => {
  //   dispatch(ibPostActions.getIBPdfRequest({ num }));
  // }, []);
  return (
    <>
      {IBContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.ib_item} key={content.num}>
            {session?.userId === 1 && (
              <button
                onClick={() => {
                  onClickDelete(content.num);
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
                <img
                  src={content.Image.src}
                  alt="잡지 이미지"
                  width={353}
                  height={400}
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
