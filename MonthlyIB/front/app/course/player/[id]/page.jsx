import CoursePlayer from "@/components/courseComponents/CoursePlayer";
import Loading from "@/components/Loading";
import { Suspense } from "react";
const CoursePlayerPage = ({ params }) => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <CoursePlayer pageId={params.id} />
      </Suspense>
    </>
  );
};

export default CoursePlayerPage;
