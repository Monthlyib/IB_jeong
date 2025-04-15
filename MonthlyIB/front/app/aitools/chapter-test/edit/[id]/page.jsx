import Loading from "@/components/Loading";
import AdminChapterTestEdit from "@/components/aiComponents/chapter_test/AdminChapterTestEdit";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AdminChapterTestEdit />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
