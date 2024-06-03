import styles from "./MyPage.module.css";
import _ from "lodash";

import Pagination from "@/components/layoutComponents/Paginatation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import shortid from "shortid";

const MyPageCourseListItems = ({
  courseContents,
  currentPage,
  numShowContents,
  onPageChange,
}) => {
  const paginate = (items, pageNum) => {
    const startIndex = (pageNum - 1) * numShowContents;
    return _(items).slice(startIndex).take(numShowContents).value();
  };
  const paginatedPage = paginate(courseContents, currentPage);

  return (
    <>
      {courseContents?.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.course_item} key={shortid.generate()}>
            <Link href={`/course/${content.videoLessonsId}`}>
              <div className={styles.course_info_wrap}>
                <figure>
                  <Image
                    src={
                      content?.videoLessonsIbThumbnailUrl !== ""
                        ? content?.videoLessonsIbThumbnailUrl
                        : "/img/common/user_profile.jpg"
                    }
                    alt="잡지 이미지"
                    width={173.66}
                    height={108}
                  />
                </figure>

                <div className={styles.course_txt}>
                  <p className={styles.course_tit}>{content.title}</p>
                  <span
                    className={styles.course_des}
                    dangerouslySetInnerHTML={{
                      __html: content.content,
                    }}
                  ></span>
                </div>
              </div>

              <div className={styles.course_play_wrap}>
                <p>
                  <FontAwesomeIcon icon={faPlayCircle} /> 수강하기
                </p>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className={styles.course_no}>
          <p>강의가 없습니다.</p>
        </div>
      )}
      {courseContents?.length > 0 && (
        <Pagination
          contents={courseContents}
          currentPage={currentPage}
          numShowContents={numShowContents}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default MyPageCourseListItems;
