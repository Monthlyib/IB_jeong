import CourseDetail from "@/components/courseComponents/CourseDetail";
import { Suspense } from "react";

const CourseDetailPage = ({ params }) => {
  return (
    <>
      <Suspense>
        <CourseDetail pageId={params.id} />
      </Suspense>
    </>
  );
};

export default CourseDetailPage;
