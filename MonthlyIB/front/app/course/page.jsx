import CourseComponents from "@/components/courseComponents/CourseComponents";
import { Suspense } from "react";
const CourseHome = () => {
  return (
    <>
      <Suspense>
        <CourseComponents />
      </Suspense>
    </>
  );
};

export default CourseHome;
