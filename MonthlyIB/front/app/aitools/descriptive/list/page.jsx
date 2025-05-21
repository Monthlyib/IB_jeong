import Loading from "@/components/Loading";

import DescriptiveTestList from "@/components/aiComponents/descriptive_test/Descriptive_testList";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <DescriptiveTestList />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
