import styles from "./CourseComponents.module.css";
import _ from "lodash";
import Pagination from "../Paginatation";
import Link from "next/link";

const CourseItems = ({
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
          <div className={styles.course_item} key={content.num}>
            <Link href={`/course/${content.num}`}>
              <figure>
                <img
                  src={content.Image.src}
                  alt="잡지 이미지"
                  width={173.66}
                  height={108}
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
