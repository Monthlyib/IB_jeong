import Loading from "@/components/Loading";
import ChapterTestResult from "@/components/aiComponents/chapter_test/ChapterTestResult";
import { Suspense } from "react";
const ChapterTestResultPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ChapterTestResult />
      </Suspense>
    </>
  );
};

export default ChapterTestResultPage;
