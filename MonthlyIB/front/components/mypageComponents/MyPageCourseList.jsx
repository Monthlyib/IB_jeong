"use client";
import { useEffect, useState } from "react";
import styles from "./MyPage.module.css";
import MyPageCourseListItems from "./MyPageCourseListItems";
import { useSession } from "next-auth/react";
import { useCourseStore } from "@/store/course";

const MyPageCourseList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: session } = useSession();
  const { coursePosts, getUserCourseList } = useCourseStore();

  useEffect(() => {
    getUserCourseList(session?.userId, currentPage - 1, session);
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
