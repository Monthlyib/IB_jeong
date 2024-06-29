import styles from "./IbComponents.module.css";
import _ from "lodash";
import Pagination from "../layoutComponents/Paginatation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faPenAlt } from "@fortawesome/free-solid-svg-icons";
import shortid from "shortid";
import Image from "next/image";

import { monthlyIBGetItem } from "@/apis/monthlyIbAPI";
import { useIBStore } from "@/store/ib";
import { useUserInfo } from "@/store/user";
import { useRouter } from "next/navigation";

const IbItems = ({
  IBContents,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const router = useRouter();
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(IBContents, currentPage);
  const { userInfo } = useUserInfo();
  const { deleteIBList } = useIBStore();
  const onClickDelete = async (num) => {
    deleteIBList(num, userInfo, currentPage);
  };

  const onClickRevise = async (num) => {
    router.push(`/ibwrite?monthlyIbId=${num}`);
  };
  const onClickPost = async (num) => {
    const res = await monthlyIBGetItem(num, userInfo);
    const url = res?.data.pdfFiles[0].fileUrl;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
  return (
    <>
      {IBContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.ib_item} key={shortid.generate()}>
            {userInfo?.authority === "ADMIN" && (
              <>
                <button
                  className={styles.delete_button}
                  onClick={() => {
                    onClickDelete(content.monthlyIbId);
                  }}
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
                <button
                  className={styles.revise_button}
                  onClick={() => {
                    onClickRevise(content.monthlyIbId);
                  }}
                >
                  <FontAwesomeIcon icon={faPenAlt} />
                </button>
              </>
            )}

            <div onClick={() => onClickPost(content.monthlyIbId)}>
              <figure>
                <Image
                  src={
                    content?.monthlyIbThumbnailUrl !== ""
                      ? content?.monthlyIbThumbnailUrl
                      : "/img/common/user_profile.jpg"
                  }
                  alt="잡지 이미지"
                  priority
                  width="353"
                  height="400"
                />
              </figure>
              <span className={styles.ib_txt}>{content.title}</span>
            </div>
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
