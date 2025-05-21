import Loading from "@/components/Loading";

import AdminDescriptiveTest from "@/components/aiComponents/descriptive_test/AdminDescriptiveTest";
import { Suspense } from "react";
const AIchaptertest = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AdminDescriptiveTest />
      </Suspense>
    </>
  );
};

export default AIchaptertest;
