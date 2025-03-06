import Loading from "@/components/Loading";
import AIIoRecording from "@/components/aiComponents/io_practice/AIIoRecording";
import { Suspense } from "react";
const AIIoPracticePage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AIIoRecording />
      </Suspense>
    </>
  );
};

export default AIIoPracticePage;
