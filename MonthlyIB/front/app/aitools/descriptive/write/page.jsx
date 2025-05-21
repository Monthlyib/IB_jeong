import Loading from "@/components/Loading";
import DescriptiveTestWrite from "@/components/aiComponents/descriptive_test/descriptive_test_write";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <DescriptiveTestWrite />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
