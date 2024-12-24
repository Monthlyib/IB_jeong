import styles from "./CourseComponents.module.css";
import _ from "lodash";
import Pagination from "./Pagination";
import Link from "next/link";
import Image from "next/image";
import shortid from "shortid";

const CourseItems = async ({
  courseContents,
  currentPage,
  totalPages,
  onPageChange,
}) => {

  return (
    <>
      {courseContents.length > 0 ? (
        courseContents.map((content) => (
          <div className={styles.course_item} key={shortid.generate()}>
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
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default CourseItems;
