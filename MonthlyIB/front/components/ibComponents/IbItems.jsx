import styles from "./IbComponents.module.css";
import _ from "lodash";
import Pagination from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import shortid from "shortid";
import Image from "next/image";

import { monthlyIBGetItem } from "@/apis/monthlyIbAPI";
import Link from "next/link";
import { useIBStore } from "@/store/ib";

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
  const { deleteIBList } = useIBStore();
  const onClickDelete = async (num) => {
    deleteIBList(num, session, currentPage);
  };
  // console.log(IBContents);
  const onClickPost = async (num) => {
    // const res = await monthlyIBGetItem(num, session);
    // console.log(res);
  };
  return (
    <>
      {IBContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.ib_item} key={shortid.generate()}>
            {session?.authority === "ADMIN" && (
              <button
                className={styles.delete_button}
                onClick={() => {
                  onClickDelete(content.monthlyIbId);
                }}
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            )}

            <Link href={`/ib/${content.monthlyIbId}`}>
              <figure>
                <Image
                  src={content.monthlyIbThumbnailUrl}
                  alt="잡지 이미지"
                  priority
                  width="353"
                  height="400"
                />
              </figure>
              <span className={styles.ib_txt}>{content.title}</span>
            </Link>
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
