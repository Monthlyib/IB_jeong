import styles from "./CourseComponents.module.css";
import _ from "lodash";
import Pagination from "../layoutComponents/Paginatation";
import Link from "next/link";
import Image from "next/image";

const CourseItems = async ({
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
      {courseContents.length > 0 ? (
        paginatedPage.map((content) => (
          <div className={styles.course_item} key={content.videoLessonsId}>
            <Link href={`/course/${content.videoLessonsId}`}>
              <figure>
                <Image
                  src={
                    content?.videoLessonsIbThumbnailUrl !== ""
                      ? content?.videoLessonsIbThumbnailUrl
                      : "/img/common/user_profile.jpg"
                  }
                  priority
                  width="100"
                  height="100"
                  alt="강의 표지 사진"
                />
              </figure>
              <div className={styles.course_txt}>
                <p className={styles.course_tit}>{content.title}</p>
                <span
                  dangerouslySetInnerHTML={{
                    __html: content.content,
                  }}
                ></span>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className={styles.course_no}>
          <p>강의가 없습니다.</p>
        </div>
      )}
      {courseContents.length > 0 && (
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

export default CourseItems;
