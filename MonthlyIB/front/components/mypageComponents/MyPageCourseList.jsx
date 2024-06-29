"use client";
import { useEffect, useState } from "react";
import styles from "./MyPage.module.css";
import MyPageCourseListItems from "./MyPageCourseListItems";

import { useCourseStore } from "@/store/course";
import { useUserInfo } from "@/store/user";

const MyPageCourseList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { userInfo } = useUserInfo();
  const { coursePosts, getUserCourseList } = useCourseStore();

  useEffect(() => {
    getUserCourseList(userInfo?.userId, currentPage - 1, userInfo);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className={styles.course_wrap}>
        <div className={styles.course_cont}>
          <MyPageCourseListItems
            courseContents={coursePosts}
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
