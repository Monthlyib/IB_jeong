import Loading from "@/components/Loading";
import ChapterTestExam from "@/components/aiComponents/chapter_test/ChapterTestExam";
import { Suspense } from "react";
const ChapterTestExamPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ChapterTestExam/>
      </Suspense>
    </>
  );
};

export default ChapterTestExamPage;
