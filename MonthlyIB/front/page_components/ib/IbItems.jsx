import styles from "./IbComponents.module.css";
import _ from "lodash";
import Pagination from "../Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { ibPostActions } from "../../reducers/ibpost";
import { useCallback } from "react";

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

  const { User } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const onClickDelete = useCallback((num) => {
    dispatch(ibPostActions.deleteIBPostRequest({ num }));
  }, []);

  const onClickPost = useCallback((num) => {
    dispatch(ibPostActions.getIBPdfRequest({ num }));
  }, []);
  return (
    <>
      {IBContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.ib_item} key={content.num}>
            {User?.role === 100 && (
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
