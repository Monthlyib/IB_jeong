import Loading from "@/components/Loading";
import DescriptiveTestMain from "@/components/aiComponents/descriptive_test/descriptive_test";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <DescriptiveTestMain />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
