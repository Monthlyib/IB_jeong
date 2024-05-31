import Loading from "@/components/Loading";
import CourseComponents from "@/components/courseComponents/CourseComponents";
import { Suspense } from "react";
const CourseHome = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <CourseComponents />
      </Suspense>
    </>
  );
};

export default CourseHome;
