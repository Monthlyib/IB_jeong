import Loading from "@/components/Loading";
import CourseDetail from "@/components/courseComponents/CourseDetail";
import { Suspense } from "react";

const CourseDetailPage = ({ params }) => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <CourseDetail pageId={params.id} />
      </Suspense>
    </>
  );
};

export default CourseDetailPage;
