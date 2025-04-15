import Loading from "@/components/Loading";
import ChapterTestList from "@/components/aiComponents/chapter_test/ChapterTestList";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ChapterTestList />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
