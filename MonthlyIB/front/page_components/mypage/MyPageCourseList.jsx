import { useSelector } from "react-redux";
import { useState } from "react";
import styles from "./MyPage.module.css";
import MyPageCourseListItems from "./MyPageCourseListItems";

const MyPageCourseList = () => {
  const { User } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className={styles.course_wrap}>
        <div className={styles.course_cont}>
          <MyPageCourseListItems
            courseContents={User.courses}
            currentPage={currentPage}
            numShowContents={5}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default MyPageCourseList;
