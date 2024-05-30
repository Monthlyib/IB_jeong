import CoursePostWrite from "@/components/courseComponents/CoursePostWrite";
import { Suspense } from "react";

const CourseWriteHome = () => {
  return (
    <>
      <Suspense>
        <CoursePostWrite />
      </Suspense>
    </>
  );
};

export default CourseWriteHome;
