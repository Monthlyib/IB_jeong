import Loading from "@/components/Loading";
import AIChapterTest from "@/components/aiComponents/chapter_test/AIChapterTest";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AIChapterTest />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
