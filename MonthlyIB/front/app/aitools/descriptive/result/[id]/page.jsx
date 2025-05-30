import Loading from "@/components/Loading";
import DescriptiveTestResult from "@/components/aiComponents/descriptive_test/DescriptiveTestResult";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <DescriptiveTestResult />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
