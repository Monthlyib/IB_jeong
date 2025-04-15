import Loading from "@/components/Loading";
import AdminChapterTest from "@/components/aiComponents/chapter_test/AdminChapterTest";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AdminChapterTest />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
